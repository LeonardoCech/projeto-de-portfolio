from typing_extensions import Annotated

from firebase_admin import auth

from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, Depends, Response, HTTPException, status
from fastapi.responses import JSONResponse

from requests import post

from controller.utils import thread_slug_from_email
from controller.token import validate_token


from model.models import InsightModel
from model.constants import ANYTHING_LLM_HOST, ANYTHING_LLM_TOKEN, LLM_SLUG


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='api/v1/sessions/me')


@router.post('/me')
def patch_insights_mev1(token: Annotated[str, Depends(oauth2_scheme)],
                        form_data: InsightModel,
                        response: Response,
                        mode: str = None
                        ) -> dict:
    '''
    '''
    stts_code, detail, data = validate_token(token, check_mfa_auth=False)

    if stts_code == status.HTTP_200_OK:
        decoded_token = data['decoded_token']
        user = auth.get_user_by_email(decoded_token['sub'])

        THREAD_SLUG = thread_slug_from_email(user.email)

        if mode is None:
            mode = 'chat'

        response = post(
            f'{ANYTHING_LLM_HOST}/api/v1/workspace/{LLM_SLUG}/thread/{THREAD_SLUG}/chat',
            headers={
                'Authorization': f'Bearer {ANYTHING_LLM_TOKEN}'
            },
            json={
                'mode': mode,
                'message': form_data.message
            })

        if 'textResponse' not in response.json():
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return HTTPException(
                status_code=response.status_code,
                detail=''
            )

        result = response.json()['textResponse']

        if response.status_code == 200:
            return JSONResponse(content={'insight': result})

        else:
            response.status_code = response.status_code
            return HTTPException(
                status_code=response.status_code,
                detail=''
            )
    else:
        response.status_code = stts_code
        return HTTPException(
            status_code=stts_code,
            detail=detail
        )
