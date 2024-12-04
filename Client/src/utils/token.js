
import $ from 'jquery';

import { getUserFromCookie } from 'utils/cookies';
import { sessionsMeTokenGet } from 'apis/imports';


export const checkAuthorization = async (navigate, setIsMfaModalOpen, setUsername, setIsUserAuthenticated) => {
    
    const result = await sessionsMeTokenGet();

    if (result.isSuccess) {

        var decoded_token = decodeToken(result.response.access_token);

        if (!decoded_token) return false;

        var { fullname, email, role } = decoded_token;

        $('#user-fullname').text(fullname);
        $('#user-email').text(email);
        if (role === 'admin') $('#user-permission').show();

        setIsUserAuthenticated(true);
    }
    
    else if (result.data.hasJwt) {
        const user = getUserFromCookie();

        setIsMfaModalOpen(true);
        setUsername(user.username);
    }
    
    else navigate('/unauthorized');
};

export const decodeToken = (token) => {

    try {
        // Decode JWT token
        var base64Url = token.split('.')[1],
            base64 = base64Url.replace('-', '+').replace('_', '/'),
            decodedToken = JSON.parse(window.atob(base64)),
            tokenData = JSON.parse(decodedToken.data);

        tokenData.email = decodedToken.sub;

        return tokenData;
    }
    catch (error) {
        return null;
    }
}; 