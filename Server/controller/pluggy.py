
from requests import get, post


class PluggyAPI:
    def __init__(self, client_id: str, client_secret: str):
        self.base_url = 'https://api.pluggy.ai'
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

    def create_item(self, parameters: dict):
        '''Create a new item in Pluggy.'''
        url = f'{self.base_url}/items'
        headers = {
            'X-API-KEY': self.token,
            'accept': 'application/json',
            'content-type': 'application/json'
        }
        response = post(url, json=parameters, headers=headers)
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
