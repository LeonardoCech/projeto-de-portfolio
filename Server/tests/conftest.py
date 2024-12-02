# tests/conftest.py

import os
import json
import pytest
import pyotp

from tests.utils import delete_test_user

BASE_TEST_USER = json.loads(os.getenv('BASE-TEST-USER'))
TEMP_TEST_USER = json.loads(os.getenv('TEMP-TEST-USER'))

class ValueStorage:

    # Base user DO NOT REMOVE during the tests
    base_access_token = BASE_TEST_USER['access_token']
    base_email = BASE_TEST_USER['email']
    base_password = BASE_TEST_USER['password']
    base_fullname = BASE_TEST_USER['fullname']
    base_role = BASE_TEST_USER['role']
    base_totp_secret = BASE_TEST_USER['totp_secret']

    # Temp user to be created and removed during the tests
    temp_access_token = TEMP_TEST_USER['access_token']
    temp_email = TEMP_TEST_USER['email']
    temp_password = TEMP_TEST_USER['password']
    temp_fullname = TEMP_TEST_USER['fullname']
    temp_role = TEMP_TEST_USER['role']
    temp_totp_secret = TEMP_TEST_USER['totp_secret']


# Headers ======================================================================

def get_form_data_header(temp_user=False):
    return {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    }


def get_authorization_header(temp_user=False):

    access_token = ValueStorage.base_access_token if not temp_user else ValueStorage.temp_access_token

    return {
        'accept': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }


def get_form_data_authorization_header(temp_user=False):

    access_token = ValueStorage.base_access_token if not temp_user else ValueStorage.temp_access_token

    return {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': f'Bearer {access_token}'
    }


def get_mfa_authorization_header(oauthmfa, temp_user=False):

    access_token = ValueStorage.base_access_token if not temp_user else ValueStorage.temp_access_token

    return {
        'accept': 'aplication/json',
        'Authorization': f'Bearer {access_token}',
        'oauthmfa': oauthmfa
    }


def get_simple_header():
    return {
        'Content-Type': 'application/json',
        'accept': '*/*',
    }


def get_simple_authorization_header(temp_user=False):

    access_token = ValueStorage.base_access_token if not temp_user else ValueStorage.temp_access_token

    return {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'Authorization': f'Bearer {access_token}'
    }


@pytest.fixture
def api_default_cors():
    return {
        'route': '/',
        'headers': get_simple_header()
    }

# Endpoints ====================================================================

@pytest.fixture
def api_v1_news():
    return {
        'route': '/api/v1/news',
        'headers': {
            'get': get_simple_authorization_header()
        }
    }


@pytest.fixture
def api_v1_server_ping():
    return {
        'route': '/api/v1/server/ping',
        'headers': get_simple_header()
    }


@pytest.fixture
def api_v1_server_constants():
    return {
        'route': '/api/v1/server/constants',
        'headers': get_simple_header()
    }


@pytest.fixture
def api_v1_signals():
    return {
        'route': '/api/v1/signals',
        'headers': {
            "get": get_simple_authorization_header()
        }
    }


@pytest.fixture
def api_v1_user():
    return {
        'route': f'/api/v1/user/{ValueStorage.temp_email}',
        'headers': {
            'get': get_authorization_header(),
            'patch': get_simple_authorization_header()
        },
        'data': {
            'patch': {
                'fullname': ValueStorage.temp_fullname,
                'role': ValueStorage.temp_role
            }
        }
    }


@pytest.fixture
def api_v1_user_me():
    return {
        'route': f'/api/v1/user/me',
        'headers': {
            'get': get_authorization_header(),
            'patch': get_simple_authorization_header()
        },
        'data': {
            'patch': {
                'fullname': ValueStorage.base_fullname,
                'role': ValueStorage.base_role
            }
        }
    }


@pytest.fixture
def api_v1_user_me_validate_token():
    return {
        'route': '/api/v1/user/me/validate/token',
        'headers': get_authorization_header()
    }


@pytest.fixture
def api_v1_user_me_validate_mfa():
    return {
        'route': '/api/v1/user/me/validate/mfa',
        'headers': get_mfa_authorization_header(oauthmfa=pyotp.TOTP(ValueStorage.base_totp_secret).now(), temp_user=True)
    }


@pytest.fixture
def api_v1_user_mfa_qr_code():
    return {
        'route': f'/api/v1/user/{ValueStorage.base_email}/mfa/qr-code',
        'headers': get_authorization_header()
    }


@pytest.fixture
def api_v1_user_sign_in():
    return {
        'route': '/api/v1/user/sign/in',
        'headers': {
            'patch': get_form_data_authorization_header(temp_user=True),
            'post': get_form_data_header(temp_user=True)
        },
        'data': {
            'patch': {
                'password': 'Corr3c7_P@$$W0RD_3D173D'
            },
            'post': {
                'username': ValueStorage.temp_email,
                'password': ValueStorage.temp_password
            }
        }
    }


@pytest.fixture
def api_v1_user_sign_in_base_user():
    return {
        'route': '/api/v1/user/sign/in',
        'headers': {
            'post': get_form_data_header()
        },
        'data': {
            'post': {
                'username': ValueStorage.base_email,
                'password': ValueStorage.base_password
            }
        }
    }


@pytest.fixture
def api_v1_user_sign_out():
    return {
        'route': '/api/v1/user/sign/out',
        'headers': get_authorization_header(temp_user=True),
        'data': {
            'username': ValueStorage.base_email,
            'password': ValueStorage.base_password
        }
    }


@pytest.fixture
def api_v1_user_sign_up():
    return {
        'route': '/api/v1/user/sign/up',
        'headers': get_form_data_header(temp_user=True),
        'data': {
            'username': ValueStorage.temp_email,
            'password': ValueStorage.temp_password,
            'fullname': ValueStorage.temp_fullname
        }
    }


@pytest.fixture
def api_v1_user_send_email():
    return {
        'route': f'/api/v1/user/{ValueStorage.base_email}/send/email',
        'headers': get_authorization_header()
    }


@pytest.fixture
def api_v1_user_send_phone():
    return {
        'route': f'/api/v1/user/{ValueStorage.base_email}/send/phone',
        'headers': get_authorization_header()
    }

# Hooks ========================================================================


def pytest_sessionstart(session):
    """
    Called before whole test run begins.
    """
    pass


def pytest_sessionfinish(session, exitstatus):
    """
    Called after whole test run finished, right before
    returning the exit status to the system.
    """

    print('\n\n🧹 Post-test clean up...\n\n')

    del_user_success, del_user_msg = delete_test_user()
    if del_user_success:
        print(f"{'v' if del_user_success else 'x'}  {del_user_msg}")

    print('\n\nEXIT STATUS = ' + str(exitstatus))
