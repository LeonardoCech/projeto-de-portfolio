# api/v1/sessions/endpoints.py

import json
from typing_extensions import Annotated
from pydantic import EmailStr

# FastAPI Packages

from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, Depends, Header, Request, Response, HTTPException, status
from fastapi.responses import JSONResponse

# Firebase Packages
from firebase_admin import firestore
from firebase_admin.exceptions import FirebaseError, NotFoundError, UnavailableError

# Own packages
# from controller.firebase import *
from controller.firebase import auth, sign_in_with_password
from controller.otp import validate_hotp, validate_totp, verify_hotp, verify_totp
from controller.token import validate_token, refresh_access_token, \
    create_access_token, get_token_iat, get_token_exp
from controller.mailgun import send_email
from controller.utils import get_user_ip
from model.constants import ENV, TEMP_TOKEN_ALGORITHM
from model.models import MfaTypes, Services, SessionPostForm, UserFirebase


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='api/v1/sessions/me/mfa')


@router.delete('/me')
def delete_sessions_me_v1(token: Annotated[str, Depends(oauth2_scheme)], response: Response):
    '''
        Handles the DELETE request to /users/me/sessions endpoint.
    Invalidates the JWT.

    TODO(Developer): Add validation to don't validate users that are enabled\n
    TODO(Developer): Add validation to don't validate users that have email address verified\n
    TODO(Developer): Add erros examples on Swagger

    #### Tests:
    ./tests/api/v1/sessions/me/test_api_delete_users_me_sessions.py

    #### Args:
    - **token (str)**: The JWT token, it's taken from the 'Authorization' header.
        '''
    stts_code, detail, _ = validate_token(token, check_mfa_auth=(ENV == 'production'))

    if stts_code == status.HTTP_200_OK:
        refresh_success, e_type, token = refresh_access_token(
            token, invalidate=True)

        if refresh_success:
            return JSONResponse(content={
                'access_token': token,
                'message': 'Successfully signed out',
                'token_type': 'Bearer'
            })
        else:
            stts_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            response.status_code = stts_code
            return HTTPException(
                status_code=stts_code,
                detail={
                    'message': 'Failed to sign out',
                    'type': e_type
                }
            )
    else:
        response.status_code = stts_code
        return HTTPException(
            status_code=stts_code,
            detail=detail
        )


@router.post('/me')
def post_sessions_me_v1(form_data: Annotated[SessionPostForm, Depends()], request: Request, response: Response):
    '''
    Generates a valid JWT Token for a user.
    Updates the user metadata to set the last login date.

    TODO(Developer): Add possibilities to signin with other priveders (Apple, Google etc.)\n
    TODO(Developer): Add validation to don't validate users that are enabled\n
    TODO(Developer): Add validation to don't validate users that have email address verified\n
    TODO(Developer): Add erros examples on Swagger

    #### Tests:
    ./tests/api/v1/sessions/me/test_api_post_users_me_sessions.py

    #### Args:
    - **form_data (SessionPostForm)**: The user credentials to be validated.
    '''

    try:
        # Get user data from Firebase Authentication
        firebase_user = sign_in_with_password(form_data.username, form_data.password.get_secret_value())

        if firebase_user is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    'message': 'Invalid email or password',
                    'type': 'InvalidCredentials'
                }
            )

        db = firestore.client()
        user = UserFirebase()
        user.uid = firebase_user['localId']
        user.email = firebase_user['email']

        users_data = db.collection('users').document(
            user.uid).get().to_dict()

        if users_data is None:
            response.status_code = status.HTTP_404_NOT_FOUND
            return HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    'message': 'User not found.',
                    'type': 'UserNotFoundError'
                }
            )

        users_email = form_data.username

        token_data = {
            'fullname': users_data['fullname'],
            'role': users_data['role'],
            'x_forwarded_for': get_user_ip(request)
        }

        now = get_token_iat()

        token_dict = {
            'iss': Services.users_service.value,
            'sub': users_email,
            'uid': user.uid,
            'data': json.dumps(token_data),
            'iat': now,
            'exp': get_token_exp(now),
            'is_mfa_authorized': False
        }

        create_token_success, token = create_access_token(data=token_dict)

        if create_token_success:
            try:
                db.collection('users').document(user.uid).update({
                    'last_login': now,
                    'last_token_refresh': now
                })
                return JSONResponse(content={
                    'access_token': token,
                    'token_type': 'Bearer',
                    'first_login': 'last_login' not in users_data
                })
            except Exception as error:

                print(f'Failed to save user data: {str(error)}')

                status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                response.status_code = status_code
                return HTTPException(
                    status_code=status_code,
                    detail={
                        'message': str(error),
                        'type': type(error).__name__
                    }
                )
        else:
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            response.status_code = status_code
            return HTTPException(
                status_code=status_code,
                detail={
                    'message': str(token),
                    'type': type(token).__name__
                }
            )
    except FirebaseError as error:

        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

        # If the user doesn't exist
        if isinstance(error, NotFoundError):
            status_code = status.HTTP_404_NOT_FOUND

        # If the Firebase service is unavailable
        if isinstance(error, UnavailableError):
            status_code = status.HTTP_503_SERVICE_UNAVAILABLE

        response.status_code = status_code
        return HTTPException(
            status_code=status_code,
            detail={
                'message': str(error),
                'type': type(error).__name__
            }
        )
    except ValueError as error:

        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        response.status_code = status_code
        return HTTPException(
            status_code=status_code,
            detail={
                'message': str(error),
                'type': type(error).__name__
            }
        )
    

@router.get('/me/mfa')
async def get_sessions_me_mfa_v1(token: Annotated[str, Depends(oauth2_scheme)],
                                 response: Response, oauthmfa: Annotated[str | None, Header()] = None, language: Annotated[str | None, Header()] = 'en-US', mfa_type: MfaTypes = MfaTypes.totp):
    '''
    Validate the MFA secret for the authenticated user.

    Parameters:
    - token: The authentication token for the user. (str)
    - form_data: The form data containing the MFA check request.
    - response: The HTTP response object. (Response)

    Returns:
    - An HTTP redirect response with the appropriate status code, or
    - An HTTP exception with the appropriate status code and detail message.

    Raises:
    - FirebaseError: If there is an error with the Firebase API.

    Note:
    - This function assumes that the user is authenticated.
    - The MFA secret is retrieved from the Firestore database.
    - The MFA code is verified using the user's MFA secret.
    - If the MFA code is invalid, an HTTP exception is raised.
    - If the token is invalid or expired, an HTTP exception is raised.
    - If there is an error with the Firebase API, an HTTP exception is raised.
    '''

    stts_code, detail, data = validate_token(token, check_mfa_auth=False, check_ttl=False)

    if stts_code == status.HTTP_200_OK:

        if mfa_type == MfaTypes.totp and not validate_totp(oauthmfa):
            status_code = status.HTTP_401_UNAUTHORIZED
            response.status_code = status_code
            return HTTPException(
                status_code=status_code,
                detail={
                    'message': f'Invalid MFA code format. Expected 6 digits string. Got: \'{oauthmfa}\'',
                    'type': 'InvalidMFAFormat'
                }
            )
        elif mfa_type == MfaTypes.hotp and not validate_hotp(oauthmfa):
            status_code = status.HTTP_401_UNAUTHORIZED
            response.status_code = status_code
            return HTTPException(
                status_code=status_code,
                detail={
                    'message': f'Invalid MFA code format. Expected 6 digits string. Got: \'{oauthmfa}\'',
                    'type': 'InvalidMFAFormat'
                }
            )

        try:
            decoded_token = data['decoded_token']

            db = firestore.client()

            # Get user data from Firebase Authentication
            user = auth.get_user_by_email(decoded_token['sub'])

            if not user:
                status_code = status.HTTP_404_NOT_FOUND
                response.status_code = status_code
                return HTTPException(
                    status_code=status_code,
                    detail={
                        'message': 'User not found.',
                        'type': 'UserNotFound'
                    }
                )

            user_metadata_doc = db.collection('users').document(user.uid)
            user_metadata = user_metadata_doc.get().to_dict()

            user_oauth_doc = db.collection('oauth').document(user.email)
            user_oauth = user_oauth_doc.get().to_dict()

            if mfa_type == MfaTypes.totp and user_oauth and 'totp_secret' in user_oauth:
                if not verify_totp(oauthmfa, user_oauth['totp_secret']):
                    status_code = status.HTTP_401_UNAUTHORIZED
                    response.status_code = status_code
                    return HTTPException(
                        status_code=status_code,
                        detail={
                            'message': 'Invalid MFA code.',
                            'type': 'InvalidMFA'
                        }
                    )

            elif mfa_type == MfaTypes.hotp and user_oauth and 'hotp_secret' in user_oauth:
                verify_hotp_success = verify_hotp(oauthmfa, user_oauth['hotp_secret'], user_oauth['hotp_counter'])
                if not verify_hotp_success:
                    status_code = status.HTTP_401_UNAUTHORIZED
                    response.status_code = status_code
                    return HTTPException(
                        status_code=status_code,
                        detail={
                            'message': 'Invalid MFA code.',
                            'type': 'InvalidMFA'
                        }
                    )

            if mfa_type == MfaTypes.hotp:
                users_metadata = db.collection('users').document(user.uid)
                users_metadata.update({
                    'email_verified': True
                })

                if not 'uid' in decoded_token:
                    decoded_token['uid'] = user.uid

            content = {
                'success': True,
                'code': oauthmfa
            }

            decoded_token['is_mfa_authorized'] = True
            
            iat = get_token_iat()
            decoded_token['iat'] = iat
            decoded_token['exp'] = get_token_exp(iat=iat)

            create_token_success, token = create_access_token(data=decoded_token)

            if create_token_success:
                content['access_token'] = token
                content['token_type'] = 'Bearer'
            else:
                status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                response.status_code = status_code
                return HTTPException(
                    status_code=status_code,
                    detail={
                        'message': str(token),
                        'type': type(token).__name__
                    }
                )

            if stts_code == status.HTTP_200_OK:

                if 'data' in decoded_token:
                    try:
                        x_forwarded_for = json.loads(decoded_token['data']).get('x_forwarded_for')
                    except json.JSONDecodeError:
                        x_forwarded_for = '-'
                else:
                    x_forwarded_for = '-'

                is_success = send_email(
                    html_id='account-accessed',
                    lang=language,
                    user_ip=x_forwarded_for,
                    user_email=user.email,
                    user_fullname=user_metadata['fullname'],
                    hotp_code=oauthmfa
                )

                if not is_success:
                    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                    response.status_code = status_code
                    return HTTPException(
                        status_code=status_code,
                        detail={
                            'message': 'Mailgun: Could not send email.',
                            'type': 'CouldNotSendEmail'
                        }
                    )

                return JSONResponse(content=content)
            else:
                response.status_code = stts_code
                return HTTPException(
                    status_code=stts_code,
                    detail=detail
                )
        except FirebaseError as error:
            stts_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            response.status_code = stts_code
            return HTTPException(
                status_code=stts_code,
                detail={
                    'message': str(error),
                    'type': type(error).__name__
                }
            )
    else:
        response.status_code = stts_code
        return HTTPException(
            status_code=stts_code,
            detail=detail
        )


@router.get('/me/temp/mfa', status_code=status.HTTP_308_PERMANENT_REDIRECT)
async def get_sessions_me_mfa_v1(token: Annotated[str, Depends(oauth2_scheme)],
                                 response: Response, mfa_type: MfaTypes, oauthmfa: Annotated[str | None, Header()] = None):
    '''
    Validate the MFA secret for the unauthenticated user.

    Parameters:
    - token: The authentication token for the user. (str)
    - form_data: The form data containing the MFA check request.
    - response: The HTTP response object. (Response)

    Returns:
    - An HTTP redirect response with the appropriate status code, or
    - An HTTP exception with the appropriate status code and detail message.

    Raises:
    - FirebaseError: If there is an error with the Firebase API.

    Note:
    - This function assumes that the user is authenticated.
    - The MFA secret is retrieved from the Firestore database.
    - The MFA code is verified using the user's MFA secret.
    - If the MFA code is invalid, an HTTP exception is raised.
    - If the token is invalid or expired, an HTTP exception is raised.
    - If there is an error with the Firebase API, an HTTP exception is raised.
    '''

    stts_code, detail, data = validate_token(token, check_mfa_auth=False, check_ttl=False)

    if stts_code == status.HTTP_200_OK:

        if mfa_type == MfaTypes.totp and not validate_totp(oauthmfa):
            status_code = status.HTTP_401_UNAUTHORIZED
            response.status_code = status_code
            return HTTPException(
                status_code=status_code,
                detail={
                    'message': f'Invalid MFA code format. Expected 6 digits string. Got: \'{oauthmfa}\'',
                    'type': 'InvalidMFAFormat'
                }
            )
        elif mfa_type == MfaTypes.hotp and not validate_hotp(oauthmfa):
            status_code = status.HTTP_401_UNAUTHORIZED
            response.status_code = status_code
            return HTTPException(
                status_code=status_code,
                detail={
                    'message': f'Invalid MFA code format. Expected 6 digits string. Got: \'{oauthmfa}\'',
                    'type': 'InvalidMFAFormat'
                }
            )

        db = firestore.client()
        decoded_token = data['decoded_token']
        username = decoded_token['sub']

        user_oauth_ref = db.collection('oauth').document(username)
        user_oauth = user_oauth_ref.get().to_dict()

        if mfa_type == MfaTypes.totp and user_oauth and 'totp_secret' in user_oauth:
            if not verify_totp(oauthmfa, user_oauth['totp_secret']):
                status_code = status.HTTP_401_UNAUTHORIZED
                response.status_code = status_code
                return HTTPException(
                    status_code=status_code,
                    detail={
                        'message': 'Invalid MFA code.',
                        'type': 'InvalidMFA'
                    }
                )
        elif mfa_type == MfaTypes.hotp and user_oauth and 'hotp_secret' in user_oauth:
            verify_hotp_success = verify_hotp(oauthmfa, user_oauth['hotp_secret'], user_oauth['hotp_counter'])
            if not verify_hotp_success:
                status_code = status.HTTP_401_UNAUTHORIZED
                response.status_code = status_code
                return HTTPException(
                    status_code=status_code,
                    detail={
                        'message': 'Invalid MFA code.',
                        'type': 'InvalidMFA'
                    }
                )

        content = {
            'success': True,
            'code': oauthmfa
        }

        decoded_token['is_mfa_authorized'] = True

        create_token_success, token = create_access_token(data=decoded_token, algorithm=TEMP_TOKEN_ALGORITHM)

        if create_token_success:
            content['access_token'] = token
            content['token_type'] = 'Bearer'
        else:
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            response.status_code = status_code
            return HTTPException(
                status_code=status_code,
                detail={
                    'message': str(token),
                    'type': type(token).__name__
                }
            )

        if stts_code == status.HTTP_200_OK:
            return JSONResponse(content=content)

        else:
            response.status_code = stts_code
            return HTTPException(
                status_code=stts_code,
                detail=detail
            )
    else:
        response.status_code = stts_code
        return HTTPException(
            status_code=stts_code,
            detail=detail
        )


@router.get('/{email}/temp')
def post_sessions_temp_v1(email: EmailStr, request: Request, response: Response):

    now = get_token_iat()

    token_data = {
        'x_forwarded_for': get_user_ip(request),
    }

    token_dict = {
        'iss': Services.users_service.value,
        'sub': email,
        'data': json.dumps(token_data),
        'iat': now,
        'exp': get_token_exp(now),
        'secure_hash': False
    }

    create_token_success, token = create_access_token(data=token_dict, algorithm=TEMP_TOKEN_ALGORITHM)

    if create_token_success:
        return JSONResponse(content={
            'access_token': token,
            'token_type': 'Bearer'
        })
    else:
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        response.status_code = status_code
        return HTTPException(
            status_code=status_code,
            detail={
                'message': str(token),
                'type': type(token).__name__
            }
        )


@router.get('/me/token')
def get_sessions_me_token_v1(token: Annotated[str, Depends(oauth2_scheme)], response: Response):
    '''
    Check if user has a valid token. If token is valid, refreshes it and return a new token.
    Check if user has validated their email. If they have, update the 'metadata' collection and Token data.

    TODO(Developer): Add validation to don't validate users that are enabled\n
    TODO(Developer): Add validation to don't validate users that have email address verified\n
    TODO(Developer): Add erros examples on Swagger

    #### Tests:
    ./tests/api/v1/users/token/test_api_get_users_me_validate_token.py

    #### Args:
    - **token (str)**: The JWT token, it's taken from the 'Authorization' header.
    '''
    stts_code, detail, data = validate_token(token, check_mfa_auth=(ENV == 'production'))

    if stts_code == status.HTTP_200_OK:

        db = firestore.client()
        decoded_token = data['decoded_token']
        is_ttl_valid = data['is_ttl_valid']
        user = auth.get_user(decoded_token['uid'])
        user_metadata_ref = db.collection('users').document(decoded_token['uid'])
        user_metadata_dict = user_metadata_ref.get().to_dict()

        if 'uid' not in decoded_token:
            return JSONResponse(
                content={
                    'access_token': token,
                    'temp_token': True,
                    'token_type': 'Bearer',
                    'valid': True
                }
            )

        if not is_ttl_valid:
            stts_code = status.HTTP_401_UNAUTHORIZED
            response.status_code = stts_code
            return HTTPException(
                status_code=stts_code,
                detail={
                    'message': 'The informed token is expired.',
                    'type': 'TokenExpired'
                }
            )

        elif 'is_mfa_authorized' not in decoded_token or not decoded_token['is_mfa_authorized']:
            stts_code = status.HTTP_401_UNAUTHORIZED
            response.status_code = stts_code
            return HTTPException(
                status_code=stts_code,
                detail={
                    'message': 'The informed token is not MFA authorized.',
                    'type': 'TokenNotMFAAuthorized'
                }
            )

        if user.email_verified:
            user_metadata_ref.update({'last_token_refresh': get_token_iat()})

        user_metadata_dict = user_metadata_ref.get().to_dict()

        user_data = {
            'fullname': user_metadata_dict['fullname'],
            'role': user_metadata_dict['role']
        }

        refresh_success, e_type, token = refresh_access_token(token, data=user_data)

        if refresh_success:
            return JSONResponse(
                content={
                    'access_token': token,
                    'token_type': 'Bearer',
                    'valid': refresh_success
                }
            )
        else:
            stts_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            response.status_code = stts_code
            return HTTPException(
                status_code=stts_code,
                detail={
                    'message': f'JWT Refresh Exception: {str(token)}',
                    'type': e_type
                }
            )
    else:
        response.status_code = stts_code
        return HTTPException(
            status_code=stts_code,
            detail=detail
        )
