import os

from dotenv import load_dotenv

load_dotenv()

PORT = 7001

ENV = os.getenv('ENV')

PROJECT_ID = 'minhas-financas-tcc'

ALLOWED_ORIGINS = [
    '*',
    'http://localhost:3001',
    'http://localhost:3002'
]

IDENTITY_TOOLKIT_URL = 'https://identitytoolkit.googleapis.com/v1'

ANYTHING_LLM_HOST = 'http://localhost:3001'
LLM_SLUG = 'minhas-financas-tcc'

MAILGUN_API_KEY = os.getenv('MAIL-GUN-API-KEY')
MAILGUN_DOMAIN = 'sandboxa5da889df91e48b0958eb3f7b2453050.mailgun.org'
MAILGUN_API_URL = f'https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages'
MAILGUN_FROM = 'Minhas Finanças <mailgun@sandboxa5da889df91e48b0958eb3f7b2453050.mailgun.org>'

# SEMPRE MANTENHA ESTA VARIAVEL FALASE ANTES DE QUALQUER COMMIT
UNITTESTS_SHOW_LOGS = False

# Algoritmo usado para assinar o token
TEMP_TOKEN_ALGORITHM = 'HS384'
TOKEN_ALGORITHM = 'HS256'

# Senha única baseada em HMAC (Hash-based Message Authentication Code)
HOTP_TTL = 600

# Segundos de expiração do tokem usado para assinar o JWT
TOKEN_EXPIRATION_TIME = 60 * 60

# Firebase User Fullname
USER_MODEL_FULLNAME_LENGTH_MAX = 32
USER_MODEL_FULLNAME_LENGTH_MIN = 4

# Firebase User Password
USER_MODEL_PASSWORD_LENGTH_MAX = 30
USER_MODEL_PASSWORD_LENGTH_MIN = 8
USER_MODEL_PASSWORD_REGEX = '^(?=.*[A-Z])(?=.*[!@#$&%*_-])(?=.*[0-9])(?=.*[a-z]).{8,}$'

# Firebase User Booleans
USER_MODEL_DISABLED_DEFAULT = False
USER_MODEL_EMAIL_VERIFIED_DEFAULT = True

# Firebase User Email
USER_MODEL_EMAIL_REGEX = '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$'

IPINFO_TOKEN = os.getenv('IPINFO-TOKEN')

TOKEN_SECRET_KEY = os.getenv('TOKEN-SECRET-KEY')

FIREBASE_WEB_API_KEY = os.getenv('FIREBASE-WEB-API-KEY')

ANYTHING_LLM_HOST = os.getenv('ANYTHING-LLM-HOST')
ANYTHING_LLM_TOKEN = os.getenv('ANYTHING-LLM-TOKEN')

PLUGGY_CLIENT_ID = os.getenv('PLUGGY-CLIENT-ID')
PLUGGY_CLIENT_SECRET = os.getenv('PLUGGY-CLIENT-SECRET')

PLUGGY_API_URL = 'https://api.pluggy.ai'
PLUGGY_WEBHOOK_URL = ' https://b840-45-229-202-176.ngrok-free.app/api/v1/webhooks/pluggy'