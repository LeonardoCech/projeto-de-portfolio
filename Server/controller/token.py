# controller/token.py

import json
import pytz
from datetime import datetime, timedelta
from jose import JWTError, jwt

# FastAPI Packages
from fastapi import status

# Own packages
from model.constants import TOKEN_SECRET_KEY, TOKEN_EXPIRATION_TIME, TOKEN_ALGORITHM, TEMP_TOKEN_ALGORITHM


def get_token_iat():
    local_time = datetime.now()  # Get the current local time
    utc_timezone = pytz.utc  # Create a UTC timezone object
    iat = local_time.astimezone(utc_timezone)  # Convert the local time to UTC time

    return iat


def get_token_exp(iat=get_token_iat()):
    exp = iat + timedelta(seconds=TOKEN_EXPIRATION_TIME)
    return exp


def validate_token(token, check_mfa_auth=True, check_ttl=True):
    try:
        verify_exp = True if check_ttl else False
        decode_success, decoded_token = decode_token(token, verify_exp)

        if decode_success:
            if 'uid' not in decoded_token:
                return status.HTTP_200_OK, 'Success', 'Valid Temporary Token.'

            is_mfa_authorized = 'is_mfa_authorized' in decoded_token and decoded_token['is_mfa_authorized']
            is_ttl_valid = (decoded_token['exp'] - decoded_token['iat']) <= TOKEN_EXPIRATION_TIME

            data = {
                'decoded_token': decoded_token,
                'is_mfa_authorized': is_mfa_authorized,
                'is_ttl_valid': is_ttl_valid
            }

            if (not check_mfa_auth or is_mfa_authorized) and (not check_ttl or is_ttl_valid):

                detail = {
                    'message': 'Valid token.',
                    'type': 'Success'
                }

                return status.HTTP_200_OK, detail, data

            elif check_mfa_auth and not is_mfa_authorized:

                detail = {
                    'message': 'MFA not authorized.',
                    'type': 'Error'
                }

                return status.HTTP_401_UNAUTHORIZED, detail, data

            elif check_ttl and not is_ttl_valid:

                detail = {
                    'message': 'Token expired.',
                    'type': 'Error'
                }

                return status.HTTP_401_UNAUTHORIZED, detail, data
        else:
            e_type = type(decoded_token).__name__

            detail = {
                'message': 'Token expired.',
                'type': e_type
            }
            
            if (e_type == 'ExpiredSignatureError'):
                detail['message'] = 'Token expired.'
                return status.HTTP_401_UNAUTHORIZED, detail, None
            
            detail['message'] = 'Failed to decode token.'
            return status.HTTP_500_INTERNAL_SERVER_ERROR, detail, None

    except JWTError as e:
        detail = {
            'message': f'JWT Error: {str(e)}',
            'type': type(e).__name__
        }
        return status.HTTP_500_INTERNAL_SERVER_ERROR, detail, None

    except ValueError as error:
        detail = {
            'message': {'message': f'API Exception: {str(error)}'},
            'type': type(e).__name__
        }
        return status.HTTP_500_INTERNAL_SERVER_ERROR, detail, None


def create_access_token(data: dict, algorithm=TOKEN_ALGORITHM):
    try:
        to_encode = data.copy()
        encoded_jwt = jwt.encode(to_encode, TOKEN_SECRET_KEY, algorithm=algorithm)
        return True, encoded_jwt
    except JWTError as e:
        return False, e


def decode_token(token: str, verify_exp=True):
    try:
        # Decode the JWT
        options = {'verify_exp': verify_exp}

        payload = jwt.decode(token,
                             TOKEN_SECRET_KEY,
                             algorithms=[TOKEN_ALGORITHM, TEMP_TOKEN_ALGORITHM],
                             options=options
                             )
        # The payload will contain the claims from the JWT
        return True, payload
    except JWTError as error:
        return False, error


def refresh_access_token(token, data=None, invalidate=False):
    try:
        success, decoded_token = decode_token(token, verify_exp=False)
        if success:
            new_token = decoded_token.copy()
            new_token['iat'] = get_token_iat()
            new_token['exp'] = get_token_exp(new_token['iat'])

            if data is not None:
                # Merge the new data with the existing token
                new_token['data'] = json.loads(new_token['data'])
                new_token['data'].update(data)
                new_token['data'] = json.dumps(new_token['data'])

            if invalidate:
                new_token['is_mfa_authorized'] = False

            success, token = create_access_token(data=new_token)
        else:
            token = decoded_token
        return success, 'Success', token

    except JWTError as error:
        e_type = type(error).__name__
        return False, e_type, error
