
import json
import ccxt.async_support as ccxt
import toml

from google.cloud.firestore_v1._helpers import DatetimeWithNanoseconds

from firebase_admin import firestore
from fastapi import Request

from controller.redis import Redis
from model.constants import PROJECT_ID
from model.resources import Resources

redis_db = Redis()


def is_exchange_available(exchange):
    # filter in exchanges items for "name" property equal to exchange
    resources = Resources()
    exchanges = resources.get_exchanges()

    return exchange in exchanges


def is_asset_available(asset, position):
    resources = Resources()
    if position == 'bases':
        bases = resources.get_bases(as_list_of='symbol')
        return asset in bases
    elif position == 'quotes':
        quotes = resources.get_quotes(as_list_of='symbol')
        return asset in quotes


def is_asset_base_in_exchange(asset, exchange):

    resources = Resources()
    pairs = resources.get_pairs()
    exchange = exchange.lower()
    asset = asset.upper()

    if exchange not in pairs:
        return False

    for pair in pairs[exchange]:
        if asset in pair:
            return True

    return False


def update_preset_from_appliers(preset):

    exchanges = dict()
    pairs = dict()
    timeframes = dict()

    for applier in preset['appliers']:
        splited = applier.split(':')
        exchange = splited[0]
        pair = splited[1]
        timeframe = splited[2]

        exchanges[exchange] = True
        pairs[pair] = True
        timeframes[timeframe] = True

    preset['exchanges'] = list(exchanges.keys())
    preset['pairs'] = list(pairs.keys())
    preset['timeframes'] = list(timeframes.keys())

    return preset


def get_preset(type, id):

    preset = firestore \
        .client() \
        .collection('ats') \
        .document('presets') \
        .collection(type) \
        .document(id) \
        .get()

    if preset.exists:
        return True, preset
    return False, None


def get_asset_type(asset, position):
    return asset[position][asset]["type"]


def convert_timestamps(obj):
    if isinstance(obj, dict):
        for key, value in obj.items():
            if isinstance(value, DatetimeWithNanoseconds):
                obj[key] = value.isoformat()  # Converts a timestamp to ISO 8601 format
            elif isinstance(value, dict):
                convert_timestamps(value)
    return obj


def get_pyproject_version():
    return toml.load("pyproject.toml")["tool"]["poetry"]["version"]


def get_user_ip(request: Request):
    ips = request.headers.get('X-Forwarded-For', request.client.host)
    ip = ips.split(',')[0]
    return ip


def get_available_assets(monitored_assets, user_exchanges):

    resources = Resources()
    pairs_per_exchange = resources.get_pairs()

    available_assets = {}
    user_exchanges = [exchange.lower() for exchange in user_exchanges]

    print(monitored_assets)

    for exchange, pairs in pairs_per_exchange.items():

        bases = list(set([pair.split('/')[0] for pair in pairs]))

        if exchange not in user_exchanges:
            continue

        for base in bases:
            if base not in available_assets:
                available_assets[base] = {'exchanges': []}

            if exchange not in available_assets[base]['exchanges']:
                available_assets[base]['exchanges'].append(exchange)

    available_assets = [{asset: available_assets} for asset, available_assets in available_assets.items()]

    return available_assets


def build_oauth_uri(otp_type, email, totp_secret):

    env = '' if PROJECT_ID == 'bnx-production' else (' (Staging)' if PROJECT_ID == 'bnx-staging' else ' (R&D)')
    issuer = 'Smart Trade Platform' + env
    config_uri = f'otpauth://{otp_type}/{issuer}:{email}?secret={totp_secret}&issuer={issuer}'

    return config_uri


def format_utc_id_format(datestr):
    return f'{datestr[:16]}:00 UTC'


def round_timestamp(ts):

    total_seconds = ts // 1000
    total_minutes = total_seconds // 60
    rounded_ts = total_minutes * 60 * 1000

    return rounded_ts


def fetch_tickers(exchange_slug):

    tickers = dict()

    try:
        tickers = redis_db.client.get(f'tickers:{exchange_slug}')
        if tickers is not None:
            tickers = json.loads(tickers)
    except Exception as e:
        print(e)

    return tickers
