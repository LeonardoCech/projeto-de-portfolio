import PropTypes from 'prop-types';
import $ from 'jquery';

import { appEnv, userService as users } from 'constants';

import { getAuthorization, setAuthorization } from 'utils/cookies';


const usersPatch = async (props) => {

    const { password } = props;

    const method = 'patch';
    const { hosts, version } = users;

    const host = hosts[appEnv];

    const url = `${host}/api/${version}/users`;

    const auth = await getAuthorization();

    var formdata = new FormData();
    formdata.append('password', password);

    var settings = {
        url: url,
        method: method,
        timeout: 0,
        processData: false,
        mimeType: 'multipart/form-data',
        contentType: false,
        data: formdata,
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


usersPatch.propTypes = {
    password: PropTypes.string.isRequired
};


export { usersPatch };
