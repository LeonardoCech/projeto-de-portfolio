# api/v1/server/endpoints.py

# FastAPI Packages
from fastapi import APIRouter, Request, Response, HTTPException, status
from fastapi.responses import JSONResponse

# Own packages
from controller.utils import get_user_ip
from model.models import USER_MODEL_FULLNAME_LENGTH_MAX, USER_MODEL_FULLNAME_LENGTH_MIN, USER_MODEL_PASSWORD_LENGTH_MAX, USER_MODEL_PASSWORD_LENGTH_MIN


router = APIRouter()


@router.get('/ping')
def get_server_ping_v1(request: Request, response: Response):
    '''
    '''
    try:
        return JSONResponse(content={
            'message': 'pong',
            'ip': get_user_ip(request)
        })
    except ValueError as error:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return HTTPException(
            status_code=response.status_code,
            detail={
                'message': error,
                'type': type(error).__name__
            }
        )


@router.get('/constants')
def get_server_constants_v1(response: Response):
    '''
    '''
    try:
        return JSONResponse(content={
            'UserModel': {
                'fullname': {
                    'length': {
                        'max': USER_MODEL_FULLNAME_LENGTH_MAX,
                        'min': USER_MODEL_FULLNAME_LENGTH_MIN
                    }
                },
                'password': {
                    'length': {
                        'max': USER_MODEL_PASSWORD_LENGTH_MAX,
                        'min': USER_MODEL_PASSWORD_LENGTH_MIN
                    }
                }
            }
        })
    except ValueError as error:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return HTTPException(
            status_code=response.status_code,
            detail={
                'message': error,
                'type': type(error).__name__
            }
        )
    except Exception as error:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={'message': 'Failed to get constants.'}
        )
