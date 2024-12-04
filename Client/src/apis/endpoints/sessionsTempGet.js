import PropTypes from 'prop-types';
import $ from 'jquery';

import { appEnv, userService as users } from 'constants';

import { setAuthorization } from 'utils/cookies';


const sessionsTempGet = async (props) => {

    const { email } = props;

    const method = 'get';
    const { hosts, version } = users;

    const host = hosts[appEnv];

    const url = `${host}/api/${version}/sessions/${email}/temp`;

    var settings = {
        url: url,
        method: method,
        timeout: 0,
        processData: false,
        mimeType: 'application/json',
        contentType: false
    };

    try {
        const response = await $.ajax(settings);

        setAuthorization(`${response.token_type} ${response.access_token}`);

        return { isSuccess: true, response: response };

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


sessionsTempGet.propTypes = {
    email: PropTypes.string.isRequired
};


export { sessionsTempGet };
