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
    A function that handles the GET request to the '/ping' endpoint.

    TODO(Developer): Add validation to don't validate users that are enabled
    TODO(Developer): Add validation to don't validate users that have email address verified
    TODO(Developer): Add erros examples on Swagger

    #### Tests:
    ./tests/api/v1/server/ping/test_api_get_server_ping.py
s
    #### Args:
    - **token (str)**: The JWT token, it's taken from the 'Authorization' header.
    '''
    try:
        # db = firestore.client()
        # all_documents = db.collection(METADATA_COLLECTION).get()

        # for document in all_documents:
        #         print(f'{document.id} => DELETED')
        #         auth.delete_user(document.id)
        #         db.collection(METADATA_COLLECTION).document(document.id).delete()

        # all_documents = db.collection(OAUTH_COLLECTION).get()

        # for document in all_documents:
        #         print(f'{document.id} => DELETED')
        #         db.collection(METADATA_COLLECTION).document(document.id).delete()

        # print(db.collection(OAUTH_COLLECTION).document('pytest@we-bronx.io').get().to_dict())

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
        Endpoint to get constants.
    Retrieve only constants that can be used in the client side.
    WARNING: DO NOT RETRIEVE SENSITIVE CONSTANTS, LIKE HASHS OR API KEYS.

    TODO(Developer): Add validation to don't validate users that are enabled
    TODO(Developer): Add validation to don't validate users that have email address verified
    TODO(Developer): Add erros examples on Swagger

    #### Tests:
    ./tests/api/v1/server/constants/test_api_get_server_constants.py

    #### Args:
    - None
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
