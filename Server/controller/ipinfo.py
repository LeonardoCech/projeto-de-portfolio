from requests import get

from controller.secret_manager import access_secret_version
from model.constants import PROJECT_ID

def get_ipinfo(ip):
    '''
    Get IP information from ip-api.com
    '''
    
    IPINFO_TOKEN = access_secret_version(PROJECT_ID, 'ipinfo-token')

    try:
        response = get(f'https://ipinfo.io/{ip}?token={IPINFO_TOKEN}', timeout=5)
        response.raise_for_status()

        if response.status_code == 200:
            return {
                'sucess': True,
                'status_code': response.status_code,
                'data': response.json()
            }
        else:
            return {
                'sucess': False,
                'status_code': response.status_code,
                'data': None
            }
    except Exception as e:
        return {
            'sucess': False,
            'status_code': 500,
            'error': str(e),
            'data': None
        }
