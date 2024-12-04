# controller/mailgun.py
# Reference: https://www.mailgun.com/blog/it-and-engineering/send-email-using-python/

from requests import post
from controller.ipinfo import get_ipinfo
from model.constants import MAILGUN_API_URL, MAILGUN_API_KEY, MAILGUN_FROM

# controller/mailgun.py
# Reference: https://www.mailgun.com/blog/it-and-engineering/send-email-using-python/

from requests import post
from controller.ipinfo import get_ipinfo
from model.constants import MAILGUN_API_URL, MAILGUN_API_KEY, MAILGUN_FROM
from datetime import datetime as dt
import pytz
import json


def send_email(user_ip, user_email, hotp_code, user_fullname='', html_id='mfa-code', lang='pt-BR'):
    # IP info logic

    
    ipinfo_response = get_ipinfo(user_ip)

    location = '-'
    timezone = 'GMT'

    if ipinfo_response['sucess'] == True:
        ipinfo_dict = ipinfo_response['data']
        if 'city' in ipinfo_dict and 'region' in ipinfo_dict and 'country' in ipinfo_dict:
            location = f"{ipinfo_dict['city']}, {ipinfo_dict['region']}, {ipinfo_dict['country']}"

        if 'timezone' in ipinfo_dict:
            timezone = ipinfo_dict['timezone']

    datetime = dt.now(pytz.utc) \
        .astimezone(pytz.timezone(timezone)) \
        .strftime("%Y-%m-%d %H:%M:%S %Z")

    # Email content and translation logic
    html_content = open(f'src/emails/templates/{html_id}.html', encoding="utf8").read()
    translations = json.loads(open(f'src/emails/translations/{html_id}.json', encoding="utf8").read())

    if lang in translations:
        t = translations[lang]
    else:
        t = translations['pt-BR']

    if html_id == 'mfa-code':

        t['paragraph2'] = t['paragraph2'].replace('{datetime}', datetime)
        t['paragraph3'] = t['paragraph3'].replace('{location}', location)
        t['paragraph4'] = t['paragraph4'].replace('{ip}', user_ip)

        html_content = html_content \
            .replace('{lang}', lang) \
            .replace('{title}', t['title']) \
            .replace('{paragraph0}', t['paragraph0']) \
            .replace('{paragraph1}', t['paragraph1']) \
            .replace('{paragraph2}', t['paragraph2']) \
            .replace('{paragraph3}', t['paragraph3']) \
            .replace('{paragraph4}', t['paragraph4']) \
            .replace('{emailInfo}', t['emailInfo']) \
            .replace('{question}', t['question']) \
            .replace('{token}', hotp_code)

    elif html_id == 'account-accessed':

        t['paragraph0'] = t['paragraph0'] \
            .replace('{fullname}', user_fullname) \
            .replace('{username}', user_email)
        t['paragraph1'] = t['paragraph1'].replace('{datetime}', datetime)
        t['paragraph2'] = t['paragraph2'].replace('{location}', location)
        t['paragraph3'] = t['paragraph3'].replace('{ip}', user_ip)

        html_content = html_content \
            .replace('{lang}', lang) \
            .replace('{title}', t['title']) \
            .replace('{paragraph0}', t['paragraph0']) \
            .replace('{paragraph1}', t['paragraph1']) \
            .replace('{paragraph2}', t['paragraph2']) \
            .replace('{paragraph3}', t['paragraph3']) \
            .replace('{emailInfo}', t['emailInfo']) \
            .replace('{question}', t['question'])

    # Sending email using Mailgun API
    return send_single_email(user_email, t['subject'], content=html_content)


def send_single_email(to_address: str, subject: str, content: str = '', content_type: str = 'html'):

    request_data = {
        'from': MAILGUN_FROM,
        'to': to_address,
        'subject': subject
    }

    if content_type == 'text':
        request_data['text'] = content
    else:
        request_data['html'] = content

    try:
        response = post(
            MAILGUN_API_URL,
            auth=('api', MAILGUN_API_KEY),
            data=request_data
        )
        
        if response.status_code == 200:
            return True
        else:
            print(f'[Mailgun] Could not send the email, reason: {response.text}')
            return False

    except Exception as e:
        print(f'[Mailgun] Could not send the email, reason: {e}')
        return False
