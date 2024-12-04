import $ from 'jquery';

import { appEnv, userService as users } from 'constants';

import { getAuthorization } from 'utils/cookies';


const pluggyConnectorsGet = async () => {

    const method = 'get';
    const { hosts, version } = users;

    const host = hosts[appEnv];

    const url = `${host}/api/${version}/pluggy/connectors?online_only=true`;

    const auth = await getAuthorization();

    var settings = {
        url: url,
        method: method,
        timeout: 0,
        processData: false,
        mimeType: 'application/json',
        contentType: 'application/json',
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Authorization', auth);
        }
    };

    try {
        const response = await $.ajax(settings);

        return { isSuccess: true, response };

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


export { pluggyConnectorsGet };
