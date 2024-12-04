import PropTypes from 'prop-types';
import $ from 'jquery';

import { appEnv, userService as users } from 'constants';


const emailsPost = async (props) => {

    const { email, language } = props;

    const method = 'post';
    const { hosts, version } = users;

    const host = hosts[appEnv];
    const url = `${host}/api/${version}/emails/${email}`;

    var settings = {
        url: url,
        method: method,
        timeout: 0,
        processData: false,
        mimeType: 'application/ json',
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Language', language);
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


emailsPost.propTypes = {
    email: PropTypes.string.isRequired
};


export { emailsPost };
