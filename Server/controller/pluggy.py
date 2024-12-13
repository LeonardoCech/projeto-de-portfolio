
from requests import get, post, delete

from model.constants import PLUGGY_API_URL


class PluggyAPI:
    def __init__(self, client_id: str, client_secret: str):
        self.base_url = PLUGGY_API_URL
        self.client_id = client_id
        self.client_secret = client_secret
        self.token = self.get_token()

    def get_token(self) -> str:
        '''Authenticate with Pluggy.ai and retrieve an access token.'''
        url = f'{self.base_url}/auth'
        payload = {
            'clientId': self.client_id,
            'clientSecret': self.client_secret
        }
        response = post(url, json=payload)
        response.raise_for_status()
        return response.json()['apiKey']

    def connect_token(self):
        url = f'{self.base_url}/connect_token'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = post(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def get_items(self):
        '''Retrieve items linked to the Pluggy account.'''
        url = f'{self.base_url}/items'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def get_item(self, item_id: str):
        '''Retrieve details of a specific item.'''
        url = f'{self.base_url}/items/{item_id}'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def create_item(self, payload: dict):
        '''Create a new item in Pluggy.'''
        url = f'{self.base_url}/items'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    
    def delete_item(self, item_id: str):
        '''Delete an item from Pluggy.'''
        url = f'{self.base_url}/items/{item_id}'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = delete(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def send_mfa(self, payload: dict):
        '''Send MFA to Pluggy.'''
        url = f'{self.base_url}/mfa'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()

    def get_connectors(self):
        '''Retrieve available connectors from Pluggy.'''
        url = f'{self.base_url}/connectors'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def get_connector(self, connector_id: str):
        '''Retrieve details of a specific connector.'''
        url = f'{self.base_url}/connectors/{connector_id}'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def get_accounts(self):
        '''Retrieve available accounts from Pluggy.'''
        url = f'{self.base_url}/accounts'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def create_webhook(self, payload: dict):
        '''Create a new webhook in Pluggy.'''
        url = f'{self.base_url}/webhooks'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    
    def list_accounts(self, item_id, type):
        '''Retrieve available accounts from Pluggy.'''
        url = f'{self.base_url}/accounts?itemId={item_id}&type={type}'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = get(url, headers=headers)
        response.raise_for_status()
        return response.json()