# api/v1/users/endpoints.py

import json
from typing_extensions import Annotated

# FastAPI Packages
from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, Depends, Request, Response, HTTPException, status
from fastapi.responses import JSONResponse

# Firebase Packages
from firebase_admin import auth, exceptions, firestore

# Own packages
from controller.otp import generate_hotp, get_current_timestamp
from controller.token import validate_token, get_token_iat, create_access_token, get_token_exp
from controller.utils import get_user_ip, thread_slug_from_email
from model.constants import ANYTHING_LLM_HOST, ANYTHING_LLM_TOKEN, USER_MODEL_EMAIL_VERIFIED_DEFAULT, TEMP_TOKEN_ALGORITHM
from model.models import UserCredentials, UserModel, UserSettingsModel, UserCreatePostForm, Roles, Services

from requests import post, delete


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='api/v1/sessions/me')


@router.get('/me')
def get_users_me_v1(token: Annotated[str, Depends(oauth2_scheme)], response: Response):
    '''
    Get the own user metadata by the JWT.

    TODO(Developer): Add validation to don't validate users that are enabled\n
    TODO(Developer): Add validation to don't validate users that have email address verified\n
    TODO(Developer): Add erros examples on Swagger\n
    TODO(Developer): Add Pytests to test this endpoint

    #### Tests:
    ./tests/api/v1/users/me/test_api_get_users_me.py

    #### Args:
    - **token (str)**: The JWT token, it's taken from the 'Authorization' header.
    '''
    stts_code, detail, data = validate_token(token, check_mfa_auth=False)

    if stts_code == status.HTTP_200_OK:
        db = firestore.client()
        decoded_token = data['decoded_token']
        email = decoded_token['sub']
        user = auth.get_user_by_email(email)

        users_data = db.collection('users').document(
            user.uid).get().to_dict()
        users_data['uid'] = user.uid

        del users_data['uid']
        del users_data['email_verified']
        del users_data['updated_at']

        if 'last_login' in users_data:
            del users_data['last_login']

        if 'last_token_refresh' in users_data:
            del users_data['last_token_refresh']

        return users_data
    else:
        response.status_code = stts_code
        return HTTPException(
            status_code=stts_code,
            detail=detail
        )


@router.patch('/me')
def patch_users_me_v1(token: Annotated[str, Depends(oauth2_scheme)], doc_metadata: UserSettingsModel, response: Response):
    '''
    '''
    stts_code, detail, data = validate_token(token)

    if stts_code == status.HTTP_200_OK:
        db = firestore.client()
        decoded_token = data['decoded_token']
        user = auth.get_user_by_email(decoded_token['sub'])

        users_metadata = db.collection('users').document(user.uid)
        users_oauth = db.collection('oauth').document(user.email)

        doc_oauth = dict()
        doc_metadata = {key: value for key, value in doc_metadata.__dict__.items()
                        if value is not None}

        if len(doc_metadata) == 0:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    'message': 'Nothing to update, body is empty',
                    'type': 'BadRequest'
                }
            )

        doc_metadata['updated_at'] = get_token_iat()

        users_metadata.update(doc_metadata)

        if len(doc_oauth) > 0:
            users_oauth.update(doc_oauth)

        return users_metadata.get().to_dict()
    else:
        response.status_code = stts_code
        return HTTPException(
            status_code=stts_code,
            detail=detail
        )


@router.patch('/me/credentials')
def patch_users_me_credentials_v1(token: Annotated[str, Depends(oauth2_scheme)], form_data: UserCredentials, response: Response):
    '''
    '''
    stts_code, detail, data = validate_token(token)

    if stts_code == status.HTTP_200_OK:
        db = firestore.client()
        decoded_token = data['decoded_token']
        user = auth.get_user_by_email(decoded_token['sub'])

        users_metadata = db.collection('users').document(user.uid)
        users_oauth = db.collection('oauth').document(user.email)

        users_metadata = {key: value for key, value in users_metadata.__dict__.items()
                          if value is not None}
        doc_oauth = dict()

        if len(users_metadata) == 0:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    'message': 'Nothing to update, body is empty',
                    'type': 'BadRequest'
                }
            )

        # User password on Firebase Authentication
        try:
            auth.update_user(
                user.uid,
                password=form_data.password
            )
        except auth.AuthError as e:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    'message': 'Error updating password in Firebase Authentication',
                    'type': 'AuthError',
                    'detail': str(e)
                }
            )

        users_metadata['updated_at'] = firestore.SERVER_TIMESTAMP

        users_metadata.update(users_metadata)

        if len(doc_oauth) > 0:
            users_oauth.update(doc_oauth)

        return users_metadata.get().to_dict()
    else:
        response.status_code = stts_code
        return HTTPException(
            status_code=stts_code,
            detail=detail
        )


@router.post('/me', status_code=status.HTTP_201_CREATED)
def post_users_me_v1(form_data: Annotated[UserCreatePostForm, Depends()], request: Request, response: Response):
    '''
    '''
    form_data.password = UserModel.dump_secret(form_data.password)

    def save_users_data(form_data: UserCreatePostForm, result):

        try:
            db = firestore.client()
            now = get_token_iat()
            users_data = {
                'username': form_data.username,
                'fullname': form_data.fullname,
                'disabled': USER_MODEL_EMAIL_VERIFIED_DEFAULT,
                'email_verified': USER_MODEL_EMAIL_VERIFIED_DEFAULT,
                'role': Roles.free.value,
                'created_at': now,
                'updated_at': now
            }
            db.collection('users').document(
                result.uid).set(users_data)

            # Check if not exists a document in the 'oauth' collection
            if not db.collection('oauth').document(form_data.username).get().exists:
                db.collection('oauth').document(
                    form_data.username).set({
                        'hotp_counter': get_current_timestamp(),
                        'hotp_secret': generate_hotp()
                    })

            return True, 'Success'

        except Exception as error:

            print(f'Failed to save user data: {str(error)}')

            return False, error

    try:
        result = auth.create_user(
            email=form_data.username, password=form_data.password)

        db_success, db_result = save_users_data(form_data, result)

        if not db_success:
            stts_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            response.status_code = stts_code
            return HTTPException(
                status_code=stts_code,
                detail={
                    'type': str(db_result),
                    'message': 'User could not be created'
                }
            )

        post(
            f'{ANYTHING_LLM_HOST}/api/v1/workspace/minhas-financas-tcc/thread/new',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {ANYTHING_LLM_TOKEN}'
            },
            json={
                'name': form_data.username,
                'slug': form_data.username
            })

        now = get_token_iat()

        token_data = {
            'fullname': form_data.fullname,
            'role': Roles.free.value,
            'x_forwarded_for': get_user_ip(request)
        }

        token_dict = {
            'iss': Services.users_service.value,
            'sub': form_data.username,
            'uid': result.uid,
            'data': json.dumps(token_data),
            'iat': now,
            'exp': get_token_exp(now),
            'is_mfa_authorized': True,
            'secure_hash': True
        }

        create_token_success, token = create_access_token(
            data=token_dict, algorithm=TEMP_TOKEN_ALGORITHM)

        if create_token_success:
            return JSONResponse(content={
                'message': f'Successfully created user {result.uid}',
                'access_token': token,
                'token_type': 'Bearer'
            })

    except exceptions.AlreadyExistsError as error:
        stts_code = status.HTTP_409_CONFLICT
        response.status_code = stts_code

        return HTTPException(
            status_code=stts_code,
            detail={
                'message': str(error),
                'type': type(error).__name__
            }
        )
    except exceptions.FirebaseError as error:
        print(error)
        stts_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        response.status_code = stts_code
        return HTTPException(
            status_code=stts_code,
            detail={
                'message': str(error),
                'type': type(error).__name__
            }
        )


@router.delete('/me')
def delete_users_me_v1(token: Annotated[str, Depends(oauth2_scheme)], response: Response):
    '''
    '''
    stts_code, detail, data = validate_token(token)

    if stts_code == status.HTTP_200_OK:
        db = firestore.client()
        decoded_token = data['decoded_token']
        user = auth.get_user_by_email(decoded_token['sub'])

        delete(
            ANYTHING_LLM_HOST + '/api/v1/workspace/minhas-financas-tcc/thread/' +
            thread_slug_from_email(decoded_token["sub"]),
            headers={
                'Authorization': f'Bearer {ANYTHING_LLM_TOKEN}'
            }
        )

        db.collection('users').document(user.uid).delete()
        db.collection('oauth').document(user.email).delete()

        auth.delete_user(user.uid)

        return {'message': 'User deleted'}

    else:
        response.status_code = stts_code
        return HTTPException(
            status_code=stts_code,
            detail=detail
        )
