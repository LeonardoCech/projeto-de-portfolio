import os

from dotenv import load_dotenv

load_dotenv()

PORT = 7000

ENV = os.getenv('ENV')

PROJECT_ID = 'minhas-financas-tcc'

ALLOWED_ORIGINS = [
    'http://localhost:3000'
]

IDENTITY_TOOLKIT_URL = 'https://identitytoolkit.googleapis.com/v1'

MAILGUN_API_KEY = os.getenv('MAIL-GUN-API-KEY')

MAILGUN_DOMAIN = 'sandboxa5da889df91e48b0958eb3f7b2453050.mailgun.org'
MAILGUN_API_URL = f'https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages'
MAILGUN_FROM = 'Smart Trade Staging <mailgun@staging.we-bronx.io>'


# Debug option to show logs when run Unit Tests
# ALWAYS MAKE SURE THIS IS SET TO FALSE BEFORE ANY COMMIT
UNITTESTS_SHOW_LOGS = False

# Algoritmo usado para assinar o token
TEMP_TOKEN_ALGORITHM = 'HS384'
TOKEN_ALGORITHM = 'HS256'

# HMAC-based One-Time Password (HOTP) time-to-live is 10 minutes
HOTP_TTL = 600

# Token Expiration Time is used for signing the JWT token in seconds
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