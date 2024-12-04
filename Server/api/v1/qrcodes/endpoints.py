# api/v1/qr-codes/endpoints.py

import qrcode
from PIL import Image
from io import BytesIO
from typing_extensions import Annotated
from pydantic import EmailStr

# FastAPI Packages
from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, Depends, Response, HTTPException, status

# Firebase Packages
from firebase_admin import firestore

# Own packages
from controller.firebase import check_user_exists
from controller.token import validate_token
from controller.utils import build_oauth_uri

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='api/v1/sessions/me')


@router.get('/me')
async def get_qr_code_me_v1(token: Annotated[str, Depends(oauth2_scheme)], response: Response):
    '''
    '''
    stts_code, detail, data = validate_token(token)

    if stts_code == status.HTTP_200_OK:

        decoded_token = data['decoded_token']

        if 'is_mfa_authorized' not in decoded_token or not decoded_token['is_mfa_authorized']:
            stts_code = status.HTTP_401_UNAUTHORIZED
            response.status_code = stts_code
            return HTTPException(
                status_code=stts_code,
                detail={
                    'message': 'The informed token is not MFA authorized',
                    'type': 'InvalidToken'
                }
            )

        email = decoded_token['sub']
        db = firestore.client()
        user_oauth_ref = db.collection('oauth').document(email)

        if not user_oauth_ref.get().exists:
            response.status_code = status.HTTP_404_NOT_FOUND
            return HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    'message': 'User must be registered',
                    'type': 'NotFound'
                }
            )

        user_oauth = user_oauth_ref.get().to_dict()
        totp_secret = user_oauth['totp_secret']

        config_uri = build_oauth_uri('totp', email, totp_secret)

        user_oauth_ref.update({
            'totp_uri': config_uri,
            'updated_at': firestore.SERVER_TIMESTAMP
        })

        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(config_uri)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

        # Load the logo image
        logo = Image.open("src/images/minhas-financas-logo.png")

        # Calculate logo size
        logo_size = 250  # Ajuste conforme necessário
        logo = logo.resize((logo_size, logo_size))

        # Calculate the position to place the logo at the center
        img_w, img_h = img.size
        logo_w, logo_h = logo.size
        pos = ((img_w - logo_w) // 2, (img_h - logo_h) // 2)

        # Add logo to the QR code
        img.paste(logo, pos, mask=logo)

        # Save the image to a BytesIO buffer
        buffer = BytesIO()
        img.save(buffer, format="PNG")

        # Get the bytes from the buffer
        image_bytes = buffer.getvalue()

        # Close the buffer
        buffer.close()

        db = firestore.client()
        db.collection('oauth').document(email).update({
            'totp_uri': config_uri,
            'updated': firestore.SERVER_TIMESTAMP
        })

        # Return the image bytes as a response
        response = Response(content=image_bytes, media_type='image/png')
        return response

    response.status_code = stts_code
    return HTTPException(
        status_code=stts_code,
        detail=detail
    )


@router.get('/{email}/open')
async def get_qr_code_open_v1(email: EmailStr, response: Response):
    '''
    '''

    if check_user_exists(email):
        response.status_code = status.HTTP_403_FORBIDDEN
        return HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                'message': 'Cannot generate QR code for this user.',
                'type': 'Forbidden'
            }
        )

    db = firestore.client()
    user_oauth_ref = db.collection('oauth').document(email)

    if not user_oauth_ref.get().exists:
        status_code = status.HTTP_404_NOT_FOUND
        response.status_code = status_code
        return HTTPException(
            status_code=status_code,
            detail={
                'message': 'It is required to request POST /api/v1/email/<email> endpoint first.',
                'type': 'NotFound'
            }
        )

    user_oauth = user_oauth_ref.get().to_dict()
    totp_secret = user_oauth['totp_secret']

    config_uri = build_oauth_uri('totp', email, totp_secret)

    if config_uri is None:
        stts = status.HTTP_500_INTERNAL_SERVER_ERROR
        response.status_code = stts
        return HTTPException(
            status_code=stts,
            detail={
                'message': email + ' has no valid TOTP URI',
                'type': 'InternalServerError'
            }
        )

    user_oauth_ref.update({
        'totp_uri': config_uri,
        'updated_at': firestore.SERVER_TIMESTAMP
    })

    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(config_uri)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

    # Load the logo image
    logo = Image.open("src/images/minhas-financas-logo.png")

    # Calculate logo size
    logo_size = 250  # Ajuste conforme necessário
    logo = logo.resize((logo_size, logo_size))

    # Calculate the position to place the logo at the center
    img_w, img_h = img.size
    logo_w, logo_h = logo.size
    pos = ((img_w - logo_w) // 2, (img_h - logo_h) // 2)

    # Add logo to the QR code
    img.paste(logo, pos, mask=logo)

    # Save the image to a BytesIO buffer
    buffer = BytesIO()
    img.save(buffer, format="PNG")

    # Get the bytes from the buffer
    image_bytes = buffer.getvalue()

    # Close the buffer
    buffer.close()

    # Return the image bytes as a response
    response = Response(content=image_bytes, media_type='image/png')
    return response

