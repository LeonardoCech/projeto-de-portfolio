# api/v1/emails/endpoints.py

from typing_extensions import Annotated
from pydantic import EmailStr

# FastAPI Packages
from fastapi import APIRouter, Header, Request, Response, HTTPException, status
from fastapi.responses import JSONResponse

# Firebase Packages
from firebase_admin import firestore
from firebase_admin.exceptions import FirebaseError, NotFoundError, UnavailableError
from google.cloud.firestore_v1.base_query import FieldFilter

# Own packages
from controller.otp import get_hotp_code, generate_hotp, generate_totp, get_current_timestamp
from controller.mailgun import send_email
from controller.utils import build_oauth_uri, get_user_ip


router = APIRouter()


@router.post('/{email}')
def post_emails_v1(email: EmailStr, request: Request, response: Response, language: Annotated[str | None, Header()] = 'pt-BR'):
    '''
    '''

    try:
        db = firestore.client()
        user_ref = db.collection('users').where(filter=FieldFilter('username', '==', email)).limit(1)
        user = user_ref.get()

        # TODO(Developer): Finish this endpoint
        if len(list(user)) == 1:
            status_code = status.HTTP_409_CONFLICT
            response.status_code = status_code
            return HTTPException(
                status_code=status_code,
                detail={
                    'message': 'This endpoint must be called only on user sign up',
                    'type': 'Conflict'
                }
            )

        totp_secret = generate_totp()
        hotp_secret = generate_hotp()
        server_ts = firestore.SERVER_TIMESTAMP

        config_uri = build_oauth_uri('totp', email, totp_secret)

        user_oauth = {
            'hotp_counter': get_current_timestamp(),
            'hotp_secret': hotp_secret,
            'totp_secret': totp_secret,
            'totp_uri': config_uri,
            'created_at': server_ts,
            'updated_at': server_ts
        }

        user_oauth_ref = db.collection('oauth').document(email)

        if len(list(user)) == 0:
            user_oauth_ref.set(user_oauth)
        else:
            user_oauth = user_oauth_ref.get().to_dict()

        users_hotp_secret = user_oauth.get('hotp_secret')
        users_hotp_code, users_hotp_counter = get_hotp_code(users_hotp_secret, user_oauth['hotp_counter'])

        if user_oauth_ref.get().exists:
            user_oauth_ref.update({
                'hotp_counter': users_hotp_counter,
                'updated_at': server_ts
            })
        else:
            user_oauth['hotp_counter'] = users_hotp_counter
            user_oauth_ref.set(user_oauth)

        is_success = send_email(
            html_id='mfa-code',
            lang=language,
            user_ip=get_user_ip(request),
            user_email=email,
            hotp_code=users_hotp_code
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
        return JSONResponse(content={
            'message': 'If the user exists, a verification code has been sent to his email'
        })
    except FirebaseError as error:
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

        # If the user doesn't exist
        if isinstance(error, NotFoundError):
            status_code = status.HTTP_404_NOT_FOUND
            return HTTPException(
                status_code=status_code,
                content={
                    'message': 'User not found',
                    'type': type(error).__name__
                }
            )

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
