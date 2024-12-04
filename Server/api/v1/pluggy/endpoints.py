from typing_extensions import Annotated

from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, Depends, Response, HTTPException, status
from fastapi.responses import JSONResponse

from controller.pluggy import PluggyAPI
from controller.token import validate_token

from model.constants import PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='api/v1/sessions/me')

pluggy = PluggyAPI(PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET)


@router.get('/connectors')
def get_pluggy_connectors_v1(token: Annotated[str, Depends(oauth2_scheme)],
                             response: Response,
                             online_only: bool = False
                             ) -> dict:
    '''
    '''
    stts_code, detail, _ = validate_token(token, check_mfa_auth=False)

    if stts_code == status.HTTP_200_OK:

        try:
            results = pluggy.get_connectors()['results']

            connectors = list()
            for result in results:
                if online_only and result['health']['status'] != 'ONLINE':
                    continue

                if result['isSandbox']:
                    continue

                connectors.append(result)

            return JSONResponse(content={'connectors': connectors})

        except Exception as e:
            response.status_code = response.status_code
            return HTTPException(
                status_code=response.status_code,
                detail=str(e)
            )
    else:
        response.status_code = stts_code
        return HTTPException(
            status_code=stts_code,
            detail=detail
        )
