import PropTypes from 'prop-types';
import $ from 'jquery';

import { appEnv, userService as users } from 'constants';

import { getAuthorization } from 'utils/cookies';


const usersMePatch = async (props) => {

    const body = props.body ?? {};

    const method = 'patch';
    const { hosts, version } = users;

    const host = hosts[appEnv];

    const url = `${host}/api/${version}/users/me`;

    const auth = await getAuthorization();

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


usersMePatch.propTypes = {
    body: PropTypes.object
};


export { usersMePatch };
