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

export const userServiceHost = userService.hosts[appEnv];
export const userServiceVersion = userService.version;

export const termsOfServiceDoc = 'https://github.com/LeonardoCech/projeto-de-portfolio/blob/master/Client/src/documents/termos-servico.pdf';
export const cookiesPolicyDoc = 'https://github.com/LeonardoCech/projeto-de-portfolio/blob/master/Client/src/documents/politica-cookies.pdf';
export const privacyPolicyDoc = 'https://github.com/LeonardoCech/projeto-de-portfolio/blob/master/Client/src/documents/politica-privacidade.pdf';

export const insightSourcesLinks = {
    'cartilha_de_educacao_financeira.pdf': 'https://www.portalprev.com.br/PSM/ent/ilw1x8naej1/documentos/gpy6w8iaez1.pdf ',
    'caderno_cidadania_financeira.pdf': 'https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf',
    'quem_sonha_poupa_ebook.pdf': 'https://quemsonhapoupa.com.br/Content/doc/quem_sonha_poupa_ebook_1.pdf '
};