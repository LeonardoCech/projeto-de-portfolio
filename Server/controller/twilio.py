# controller/twilio.py
# [DEPRECATED] Using Mailgun instead

"""
Copyright (c) 2024 BNX Technologies LTDA
This script is protected by copyright laws and cannot be reproduced, distributed,
or used without written permission of the copyright owner.
"""

import json
import pytz
from datetime import datetime as dt

from controller.ipinfo import get_ipinfo

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def send_email(api_key, user_ip, user_email, hotp_code, user_fullname = '', from_email='noreply@we-bronx.io', html_id='mfa-code', lang = 'en-US'):
    # using SendGrid's Python Library
    # https://github.com/sendgrid/sendgrid-python

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
    
    html_content = open(f'src/emails/templates/{html_id}.html', encoding="utf8").read()    
    translations = json.loads(open(f'src/emails/translations/{html_id}.json', encoding="utf8").read())

    if lang in translations:
        t = translations[lang]
    else:
        t = translations['en-US']

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

        message = Mail(
            from_email=from_email,
            to_emails=user_email,
            subject=t['subject'],
            html_content=html_content
        )
        
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

        message = Mail(
            from_email=from_email,
            to_emails=user_email,
            subject=t['subject'],
            html_content=html_content
        )

    try:
        sg = SendGridAPIClient(api_key)
        sg.send(message)
        return True
    except Exception as e:
        print(e.body)
        return False
