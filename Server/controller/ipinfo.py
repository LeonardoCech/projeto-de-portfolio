from requests import get

from model.constants import IPINFO_TOKEN

def get_ipinfo(ip):
    '''
    '''

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
