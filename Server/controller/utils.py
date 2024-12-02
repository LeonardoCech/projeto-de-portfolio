
import toml

from google.cloud.firestore_v1._helpers import DatetimeWithNanoseconds

from fastapi import Request


def convert_timestamps(obj):
    if isinstance(obj, dict):
        for key, value in obj.items():
            if isinstance(value, DatetimeWithNanoseconds):
                obj[key] = value.isoformat()  # Converts a timestamp to ISO 8601 format
            elif isinstance(value, dict):
                convert_timestamps(value)
    return obj


def get_pyproject_version():
    return toml.load('pyproject.toml')['project']['version']


def get_user_ip(request: Request):
    ips = request.headers.get('X-Forwarded-For', request.client.host)
    ip = ips.split(',')[0]
    return ip


def build_oauth_uri(otp_type, email, totp_secret):

    issuer = 'Minhas Finanças'
    config_uri = f'otpauth://{otp_type}/{issuer}:{email}?secret={totp_secret}&issuer={issuer}'

    return config_uri


def format_utc_id_format(datestr):
    return f'{datestr[:16]}:00 UTC'


def round_timestamp(ts):

    total_seconds = ts // 1000
    total_minutes = total_seconds // 60
    rounded_ts = total_minutes * 60 * 1000

    return rounded_ts

