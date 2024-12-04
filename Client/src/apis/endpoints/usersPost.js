import PropTypes from 'prop-types';
import $ from 'jquery';

import { appEnv, userService as users } from 'constants';

import { setAuthorization } from 'utils/cookies';


const usersPost = async (props) => {

    const { fullname, username, password } = props;

    var formdata = new FormData();
    formdata.append('fullname', fullname);
    formdata.append('username', username);
    formdata.append('password', password);

    const method = 'post';
    const { hosts, version } = users;

    const host = hosts[appEnv];

    const url = `${host}/api/${version}/users`;

    var settings = {
        url: url,
        method: method,
        timeout: 0,
        processData: false,
        mimeType: 'multipart/form-data',
        contentType: false,
        data: formdata,
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


usersPost.propTypes = {
    fullname: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
};


export { usersPost };
