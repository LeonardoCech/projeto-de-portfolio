import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBR from './pt-BR.json';


const resources = {
    
    'pt-BR': {
        translation: ptBR,
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
