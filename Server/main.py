# main.py

# Pacotes externos
import json
import uvicorn

# FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

# Firebase
import firebase_admin
from firebase_admin import credentials

# Pacotes internos
from api.v1.emails.endpoints import router as api_v1_emails_router
from api.v1.qrcodes.endpoints import router as api_v1_qrcodes_router
from api.v1.server.endpoints import router as api_v1_server_router
from api.v1.sessions.endpoints import router as api_v1_sessions_router
from api.v1.users.endpoints import router as api_v1_users_router

from controller.utils import get_pyproject_version
from model.constants import ALLOWED_ORIGINS, PORT


if __name__ == '__main__':

    GCLOUD_SERVICE_KEY = json.loads(
        open('credentials/minhas-financas-tcc.json').read())
    certificate_json = credentials.Certificate(GCLOUD_SERVICE_KEY)

    # Obter a chave do serviço do Google Cloud da variável de amb
    default_app = firebase_admin.initialize_app(certificate_json)

    app = FastAPI(
        openapi_url='/openapi-schema.json',
        swagger_ui_parameters={
            'defaultModelsExpandDepth': -1,
            'syntaxHighlight.theme': 'tomorrow-night'
        }
    )

    app.include_router(api_v1_emails_router,
                       prefix='/api/v1/emails', tags=['Emails'])
    app.include_router(api_v1_qrcodes_router,
                       prefix='/api/v1/qr-codes', tags=['QR Codes'])
    app.include_router(api_v1_server_router,
                       prefix='/api/v1/server', tags=['Server'])
    app.include_router(api_v1_sessions_router,
                       prefix='/api/v1/sessions', tags=['Sessions'])
    app.include_router(api_v1_users_router,
                       prefix='/api/v1/users', tags=['Users'])

    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_methods=['*'],
        allow_headers=['*']
    )

    def custom_openapi():
        if app.openapi_schema:
            return app.openapi_schema
        openapi_schema = get_openapi(
            title='Minhas Finanças API',
            version=get_pyproject_version(),
            summary='REST API para o consumo pelo client do aplicativo Minhas Finanças.',
            routes=app.routes,
        )
        app.openapi_schema = openapi_schema
        return app.openapi_schema

    app.openapi = custom_openapi

    @app.get('/')
    async def root():
        return {'version': get_pyproject_version()}

    @app.options('/')
    async def cors_options():
        return {}

    uvicorn.run(app, host='0.0.0.0', port=PORT)
