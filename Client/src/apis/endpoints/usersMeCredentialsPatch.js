import PropTypes from 'prop-types';
import $ from 'jquery';

import { appEnv, userService as users } from 'constants';

import { getAuthorization, setAuthorization } from 'utils/cookies';


const usersMeCredentialsPatch = async (props) => {

    const { password } = props;

    const method = 'patch';
    const { hosts, version } = users;

    const host = hosts[appEnv];

    const url = `${host}/api/${version}/users/me/credentials`;

    const auth = await getAuthorization();

    const body = { password };

    var settings = {
        url: url,
        method: method,
        timeout: 0,
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(body),
        beforeSend: (xhr) => xhr.setRequestHeader('Authorization', auth)
    };

    try {
        const response = await $.ajax(settings);
        const parsedResponse = JSON.parse(response);

        setAuthorization(`${parsedResponse.token_type} ${parsedResponse.access_token}`, 1);

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


usersMeCredentialsPatch.propTypes = {
    password: PropTypes.string.isRequired
};


export { usersMeCredentialsPatch };
