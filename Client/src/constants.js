/* eslint-disable no-undef */

export const appEnv = process.env.REACT_APP_ENV || 'development';

export const defaults = {
    redirectTime: {
        notFound: 5 * 1000, // milliseconds
        unauthorized: 5 * 1000
    },
    theme: 'dark'
};

export const languages = {
    'pt-BR': { label: 'Português', icon: 'PT' }
};

export const userService = {
    hosts: {
        development: 'http://localhost:7001'
    },
    version: 'v1'
};

export const userServiceWs = {
    hosts: {
        development: 'ws://localhost:7001'
    },
    version: 'v1'
};

export const userServiceHost = userService.hosts[appEnv];
export const userServiceVersion = userService.version;

export const userServiceWsHost = userServiceWs.hosts[appEnv];
export const userServiceWsVersion = userServiceWs.version;

export const termsOfServiceDoc = 'https://github.com/LeonardoCech/projeto-de-portfolio/blob/master/Client/src/documents/termos-servico.pdf';
export const cookiesPolicyDoc = 'https://github.com/LeonardoCech/projeto-de-portfolio/blob/master/Client/src/documents/politica-cookies.pdf';
export const privacyPolicyDoc = 'https://github.com/LeonardoCech/projeto-de-portfolio/blob/master/Client/src/documents/politica-privacidade.pdf';