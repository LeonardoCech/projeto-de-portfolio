import $ from 'jquery';

import { appEnv, userService as users } from 'constants';

import { getAuthorization } from 'utils/cookies';


const qrCodesMeGetEndpoint = () => {
    const { hosts, version } = users;
    const host = hosts[appEnv];
    const url = `${host}/api/${version}/qr-codes/me`;
    return url;
};


const qrCodesMeGet = async () => {

    const method = 'get';
    const { hosts, version } = users;

    const host = hosts[appEnv];

    const url = `${host}/api/${version}/qr-codes/me`;

    const auth = await getAuthorization();

    var settings = {
        url: url,
        method: method,
        timeout: 0,
        processData: false,
        contentType: 'image/png',
        beforeSend: (xhr) => xhr.setRequestHeader('Authorization', auth),
        xhrFields: {
            responseType: 'blob'
        }
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


export { qrCodesMeGetEndpoint, qrCodesMeGet };
