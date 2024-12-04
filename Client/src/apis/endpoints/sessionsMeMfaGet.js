import PropTypes from 'prop-types';
import $ from 'jquery';

import { appEnv, userService as users } from 'constants';

import { getAuthorization, setAuthorization } from 'utils/cookies';


const sessionsMeMfaGet = async (props) => {

    const { oauthmfa, mfa_type, language } = props;

    const method = 'get';
    const { hosts, version } = users;

    const host = hosts[appEnv];

    const url = `${host}/api/${version}/sessions/me/mfa?mfa_type=${mfa_type}`;

    const auth = await getAuthorization();

    var settings = {
        url: url,
        method: method,
        timeout: 0,
        processData: false,
        mimeType: 'multipart/form-data',
        contentType: false,
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Authorization', auth);
            xhr.setRequestHeader('OAuthMFA', oauthmfa);
            xhr.setRequestHeader('Language', language);
        }
    };

    try {
        const response = await $.ajax(settings);
        const parsedResponse = JSON.parse(response);

        var { token_type, access_token } = parsedResponse;

        setAuthorization(`${token_type} ${access_token}`);

        return { isSuccess: true, response: parsedResponse };

    } catch (error) {
        let status = 0;
        let errorType = '';

        if (error && error.status) {

            status = error.status;
            try {
                const response = JSON.parse(error.responseText);
                if ('detail' in response && 'type' in response.detail)
                    errorType = response.detail.type;
            } catch (e) { errorType = 'InternalServerError'; }
        }

        return {
            isSuccess: false,
            errorType,
            status,
        };
    }
};


sessionsMeMfaGet.propTypes = {
    oauthmfa: PropTypes.string.isRequired,
    mfa_type: PropTypes.string.isRequired,
    authorization: PropTypes.string,
    utcTimezone: PropTypes.string
};


export { sessionsMeMfaGet };
