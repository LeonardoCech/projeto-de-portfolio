import PropTypes from 'prop-types';
import $ from 'jquery';

import { appEnv, userService as users }  from 'constants';

import { setAuthorization } from 'utils/cookies';


const usersMePost = async (props) => {

    const { fullname, username, password } = props;

    const method = 'post';
    const { hosts, version } = users;

    const host = hosts[appEnv];

    const url = `${host}/api/${version}/users/me`;

    var formdata = new FormData();
    formdata.append('fullname', fullname);
    formdata.append('username', username);
    formdata.append('password', password);
    
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

        var { token_type, access_token } = parsedResponse;

        setAuthorization(`${token_type} ${access_token}`, 1);

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


usersMePost.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
};


export { usersMePost };
