# controller/firebase.py

import json
import requests

from firebase_admin import auth

from model.constants import IDENTITY_TOOLKIT_URL, FIREBASE_WEB_API_KEY


def check_user_exists(email):
    try:
        auth.get_user_by_email(email)
        return True
    except auth.UserNotFoundError:
        return False
    except Exception as e:
        print(e)
        return False


def mask_string(string):
    return string[:3] + '*****' + string[-3:]


def sign_in_with_password(username, password, return_secure_token=False):

    # Firebase API URL for password authentication
    url = f'{IDENTITY_TOOLKIT_URL}/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}'

    # Request body JSON
    data = {
        'email': username,
        'password': password,
        'returnSecureToken': return_secure_token
    }

    try:
        # Do a POST request to the Firebase authentication API
        response = requests.post(url, json=data)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Returns the response data (usually including the access token)
            return response.json()
        else:
            # If the request was not successful, print the error message
            print(f'SignInWithPassword API Error: [{response.status_code}] {response.text}')
            return None

    except Exception as error:
        # If there was an error during the request, print the error message
        print(f'SignInWithPassword API Error: {error}')
        return None
