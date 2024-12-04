import $ from 'jquery';

import { appEnv, userService as users } from 'constants';

import { getAuthorization, setAuthorization } from 'utils/cookies';

const sessionsMeDelete = async () => {

    const method = 'delete';
    const { hosts, version } = users;

    const host = hosts[appEnv];

    const url = `${host}/api/${version}/sessions/me`;

    const auth = await getAuthorization();

    var settings = {
        url: url,
        method: method,
        timeout: 0,
        processData: false,
        mimeType: 'multipart/form-data',
        contentType: false,
        beforeSend: (xhr) => xhr.setRequestHeader('Authorization', auth)
    };

    try {
        const response = await $.ajax(settings);
        const parsedResponse = JSON.parse(response);
        setAuthorization(`${parsedResponse.token_type} ${parsedResponse.access_token}`);

        return { isSuccess: true };

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


export { sessionsMeDelete };
