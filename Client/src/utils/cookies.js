
import { defaults } from 'constants';

import { getDefaultLanguage } from 'utils/general';


export const getCookies = () => {

    let cookies = document.cookie.split(';');

    cookies = cookies.reduce((pack, cookie) => {
        let [key, value] = cookie.split('=');
        pack[key.trim()] = value;
        return pack;
    }, {});

    return cookies;
};


export const getCookie = (key) => decodeURIComponent(getCookies()[key]);


export const setCookie = (key, value, days = 7, path = '/') => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; SameSite=Lax`;
};


export const removeCookie = (key, path = '/') => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; SameSite=Lax`;
};


// Getters ----------------------------------------------------------

export const getUserFromCookie = () => {
    let bearer_token = getCookie('Authorization');
    let token = bearer_token ? bearer_token.split(' ')[1] : null;

    try {
        var base64Url = token.split('.')[1],
            base64 = base64Url.replace('-', '+').replace('_', '/'),
            decodedToken = JSON.parse(window.atob(base64)),
            tokenData = JSON.parse(decodedToken.data);

        return {
            fullname: tokenData.fullname,
            username: decodedToken.sub,
            profilePic: null
        };
    }
    catch (error) {
        return null;
    }
};


export const getAgreedCookiesPolicy = () => {
    return getCookie('agreed_cookies_policy') === 'true';
};


export const getAuthorization = async () => {
    return await getCookie('Authorization');
};


export const getEnabledToSendEmail = () => {
    return getCookie('enabled_to_send_email') === 'true';
};


export const getSelectedExchange = () => {
    const selExchange = getCookie('selected_exchange');
    return ['', '-', 'undefined'].includes(selExchange) ? defaults.exchange : selExchange;
};


export const getLanguage = () => {
    const language = getCookie('lang');
    return ['', '-', 'undefined'].includes(language) ? getDefaultLanguage() : language;
};


export const getTheme = () => {
    const theme = getCookie('theme');
    return ['', '-', 'undefined'].includes(theme) ? defaults.theme : theme;
};


export const getSelectedCurrency = () => {
    const currency = getCookie('currency');
    return ['', '-', 'undefined'].includes(currency) ? defaults.currency : currency;
};


export const getSelectedTimeframe = () => {
    const timeframe = getCookie('tickers_timeframe');
    return ['', '-', 'undefined'].includes(timeframe) ? defaults.timeframe : timeframe;
};


export const getTop100Filter = () => {
    const filter = getCookie('top100_filter');
    return ['', '-', 'undefined'].includes(filter) ? 'false' : filter;
};


// Setters ----------------------------------------------------------

export const setAgreedCookiesPolicy = () => {
    return setCookie('agreed_cookies_policy', true);
};


export const setAuthorization = (token) => {
    if (token) setCookie('Authorization', token);
    return token;
};


export const setSelectedExchange = (newExchange) => {
    if (newExchange) setCookie('selected_exchange', newExchange);
    return newExchange;
};


export const setLanguage = (newLang) => {
    if (newLang) setCookie('lang', newLang);
    return newLang;
};


export const setTheme = (newTheme) => {
    if (newTheme) setCookie('theme', newTheme);
    return newTheme;
};


export const setSelectedCurrency = (newCurrency) => {
    if (newCurrency) setCookie('currency', newCurrency);
    return newCurrency;
};


export const setSelectedTimeframe = (newTimeframe) => {
    if (newTimeframe) setCookie('tickers_timeframe', newTimeframe);
    return newTimeframe;
};


export const setTop100Filter = (newFilter) => {
    if (newFilter) setCookie('top100_filter', newFilter);
    return newFilter;
};
