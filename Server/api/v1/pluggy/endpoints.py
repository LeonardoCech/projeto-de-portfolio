from pydantic import BaseModel
from typing_extensions import Annotated

from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, Depends, Response, HTTPException, status
from fastapi.responses import JSONResponse

from firebase_admin import firestore, auth
from google.cloud.firestore_v1.base_query import FieldFilter

from controller.pluggy import PluggyAPI
from controller.token import validate_token

from model.constants import PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET, PLUGGY_WEBHOOK_URL


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='api/v1/sessions/me')


class PluggyItemPayload(BaseModel):
    connector_id: int
    parameters: dict

    def model_dump(self):
        return {
            'connectorId': self.connector_id,
            'parameters': self.parameters
        }


class PluggyMFAPayload(BaseModel):
    token: str

    def model_dump(self):
        return {
            'token': self.token
        }


class PluggyWebhookPayload(BaseModel):
    url: str
    event: str

    def model_dump(self):
        return {
            'url': self.url,
            'event': self.event
        }


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
            pluggy = PluggyAPI(PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET)

            results = pluggy.get_connectors()['results']

            db = firestore.client()

            demo_connectors = db \
                .collection('demo') \
                .document('data') \
                .collection('connectors') \
                .get()
            demo_connectors = [connector.to_dict()
                               for connector in demo_connectors]

            connectors = demo_connectors

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


@router.post('/item')
def post_pluggy_create_item(token: Annotated[str, Depends(oauth2_scheme)],
                            form_data: PluggyItemPayload,
                            response: Response,
                            is_demo: bool = False
                            ) -> dict:

    stts_code, detail, data = validate_token(token, check_mfa_auth=False)

    if stts_code == status.HTTP_200_OK:

        try:
            if is_demo:
                decoded_token = data['decoded_token']
                user = auth.get_user_by_email(decoded_token['sub'])
                db = firestore.client()

                demo_connector = db \
                    .collection('demo') \
                    .document('data') \
                    .collection('connectors') \
                    .document(str(form_data.connector_id)) \
                    .get() \
                    .to_dict()
                

                user_meta_ref = db \
                    .collection('users') \
                    .document(user.uid)

                user_meta = user_meta_ref.get().to_dict()

                items = user_meta.get('items', {})

                items[demo_connector['itemId']] = False

                user_meta_ref.update({ 'items': items })

                return JSONResponse(content={'status': 'ok'})

            pluggy = PluggyAPI(PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET)

            item_payload = form_data.model_dump()
            item_payload['webhookUrl'] = PLUGGY_WEBHOOK_URL

            new_item = pluggy.create_item(item_payload)

            db \
                .collection('users') \
                .document(user.uid) \
                .update({
                    f'items.{new_item["itemId"]}': True
                })

            return JSONResponse(content={'status': 'ok'})

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
    

@router.delete('/item/{item_id}')
def delete_pluggy_item_v1(token: Annotated[str, Depends(oauth2_scheme)],
                         response: Response,
                         item_id: str):
    
    stts_code, detail, data = validate_token(token, check_mfa_auth=False)

    if stts_code == status.HTTP_200_OK:

        try:
            decoded_token = data['decoded_token']
            user = auth.get_user_by_email(decoded_token['sub'])
            db = firestore.client()

            user_meta_ref = db \
                .collection('users') \
                .document(user.uid)

            user_meta = user_meta_ref.get().to_dict()

            items = user_meta.get('items', {})

            del items[item_id]

            user_meta_ref.update({ 'items': items })

            pluggy = PluggyAPI(PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET)

            pluggy.delete_item(item_id)

            return JSONResponse(content={'status': 'ok'})

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




@router.post('/mfa')
def post_pluggy_send_mfa(token: Annotated[str, Depends(oauth2_scheme)],
                         form_data: PluggyMFAPayload,
                         response: Response
                         ) -> dict:

    stts_code, detail, _ = validate_token(token, check_mfa_auth=False)

    if stts_code == status.HTTP_200_OK:

        try:
            pluggy = PluggyAPI(PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET)

            return JSONResponse(content=pluggy.send_mfa(form_data.model_dump()))

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


@router.get('/accounts')
def get_pluggy_list_accounts(token: Annotated[str, Depends(oauth2_scheme)],
                             response: Response,
                             type: str
                             ) -> dict:

    stts_code, detail, data = validate_token(token, check_mfa_auth=False)

    if stts_code == status.HTTP_200_OK:

        try:
            pluggy = PluggyAPI(PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET)
            decoded_token = data['decoded_token']
            user = auth.get_user_by_email(decoded_token['sub'])
            db = firestore.client()

            user_meta = db \
                .collection('users') \
                .document(user.uid) \
                .get() \
                .to_dict()

            if 'items' not in user_meta:
                return JSONResponse(content=[])

            demo_item_ids = [item_id for (
                item_id, is_real) in user_meta['items'].items() if not is_real]
            real_item_ids = [item_id for (
                item_id, is_real) in user_meta['items'].items() if is_real]

            accounts = list()

            if len(demo_item_ids) > 0:
                demo_accounts_query = db \
                    .collection('demo') \
                    .document('data') \
                    .collection('accounts') \
                    .where(filter=FieldFilter('itemId', 'in', demo_item_ids)) \

                if type == 'BANK' or type == 'CREDIT':
                    demo_accounts_query \
                        .where(filter=FieldFilter('type', '==', type))

                accounts += [
                    demo_account.to_dict()
                    for demo_account in demo_accounts_query.get()
                ]

            for real_item_id in real_item_ids:
                accounts += pluggy.list_accounts(real_item_id, type)['results']

            return JSONResponse(content=accounts)

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


@router.get('/investments')
def get_pluggy_list_investments(token: Annotated[str, Depends(oauth2_scheme)],
                                response: Response
                                ) -> dict:

    stts_code, detail, data = validate_token(token, check_mfa_auth=False)

    if stts_code == status.HTTP_200_OK:

        try:
            pluggy = PluggyAPI(PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET)
            decoded_token = data['decoded_token']
            user = auth.get_user_by_email(decoded_token['sub'])
            db = firestore.client()

            user_meta = db \
                .collection('users') \
                .document(user.uid) \
                .get() \
                .to_dict()

            if 'items' not in user_meta:
                return JSONResponse(content=[])

            demo_item_ids = [item_id for (
                item_id, is_real) in user_meta['items'].items() if not is_real]
            real_item_ids = [item_id for (
                item_id, is_real) in user_meta['items'].items() if is_real]

            accounts = list()

            if len(demo_item_ids) > 0:
                demo_accounts_query = db \
                    .collection('demo') \
                    .document('data') \
                    .collection('investments') \
                    .where(filter=FieldFilter('itemId', 'in', demo_item_ids)) \

                if type == 'BANK' or type == 'CREDIT':
                    demo_accounts_query \
                        .where(filter=FieldFilter('type', '==', type))

                accounts += [
                    demo_account.to_dict()
                    for demo_account in demo_accounts_query.get()
                ]

            for real_item_id in real_item_ids:
                accounts += pluggy.list_accounts(real_item_id, type)['results']

            return JSONResponse(content=accounts)

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


@router.post('/webhook')
def post_pluggy_create_webhook(token: Annotated[str, Depends(oauth2_scheme)],
                               form_data: PluggyWebhookPayload,
                               response: Response
                               ) -> dict:

    stts_code, detail, _ = validate_token(token, check_mfa_auth=False)

    if stts_code == status.HTTP_200_OK:

        try:
            pluggy = PluggyAPI(PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET)

            return JSONResponse(content=pluggy.create_webhook(form_data.model_dump()))

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
