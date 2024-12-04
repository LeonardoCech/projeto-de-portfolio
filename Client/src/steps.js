import $ from 'jquery';

import deDE from 'locales/de-DE.json';
import enUS from 'locales/en-US.json';
import esES from 'locales/es-ES.json';
import frFR from 'locales/fr-FR.json';
import huHU from 'locales/hu-HU.json';
import inIN from 'locales/hi-IN.json';
import itIT from 'locales/it-IT.json';
import jaJP from 'locales/ja-JP.json';
import koKR from 'locales/ko-KR.json';
import poPL from 'locales/po-PL.json';
import ptBR from 'locales/pt-BR.json';
import ruRU from 'locales/ru-RU.json';


const getCookies = () => {

    let cookies = document.cookie.split(';');

    cookies = cookies.reduce((pack, cookie) => {
        let [key, value] = cookie.split('=');
        pack[key.trim()] = value;
        return pack;
    }, {});

    return cookies && cookies.language ? cookies.language.replace('-', '') : enUS;
};


const getLanguage = (language) => {
    if (language === 'deDE') { return deDE; } 
    else if (language === 'enUS') { return enUS; }
    else if (language === 'esES') { return esES; }
    else if (language === 'frFR') { return frFR; } 
    else if (language === 'huHU') { return huHU; }
    else if (language === 'inIN') { return inIN; }
    else if (language === 'itIT') { return itIT; }
    else if (language === 'jaJP') { return jaJP; }
    else if (language === 'koKR') { return koKR; }
    else if (language === 'poPL') { return poPL; }
    else if (language === 'ptBR') { return ptBR; }
    else if (language === 'ruRU') { return ruRU; }
    else { return enUS; }
};


const stepsOverview = [
    {
        selector: '#logo-container',
        content: getLanguage(getCookies())['tutorial']['overview']['0'],
        resizeObservables: ['#logo-container'],
        action: () => {
            document.getElementById('toolbar-container').classList.add('stepping');
            if (document.getElementById('actions-dd').style.display === 'block') {
                $('#actions-dd').fadeOut();
            }
        },
    },
    {
        selector: '#session-user',
        content: getLanguage(getCookies())['tutorial']['overview']['1'],
        highlightedSelectors: ['#actions-dd'],
        mutationObservables: ['#actions-dd'],
        resizeObservables: ['#actions-dd', '#session-user'],
        actionAfter: () => {
            if (document.getElementById('actions-dd').style.display === 'block') {
                $('#actions-dd').fadeOut();
            }
        }
    },
    {
        selector: '#theme-switch-step',
        content: getLanguage(getCookies())['tutorial']['overview']['2'],
        resizeObservables: ['#actions-dd', '#session-user'],
    },
    {
        selector: '#lang-switch-step',
        content: getLanguage(getCookies())['tutorial']['overview']['3'],
        highlightedSelectors: ['#lang-switch-step', '#lang-dd', '#lang-selector-list'],
        mutationObservables: ['#lang-switch-step', '#lang-dd', '#lang-selector-list'],
        resizeObservables: ['#lang-switch-step', '#lang-dd', '#lang-selector-list'],
        action: () => {
            $('#lang-dd').fadeIn();
            $('#lang-selector-list').fadeIn();
            if (!document.getElementById('toolbar-container').classList.contains('stepping')) {
                document.getElementById('toolbar-container').classList.add('stepping');
            }
        },
        actionAfter: () => {
            $('#lang-dd').fadeOut();
            $('#lang-selector-list').fadeIn();
        }
    },
    {
        selector: '#wallet',
        content: getLanguage(getCookies())['tutorial']['overview']['4'],
        action: () => {
            document.getElementById('toolbar-container').classList.remove('stepping');
        }
    },
    {
        selector: '#timeline',
        content: getLanguage(getCookies())['tutorial']['overview']['5'],
        highlightedSelectors: ['#timeline'],
        mutationObservables: ['#timeline'],
        resizeObservables: ['#timeline'],
    },
    {
        selector: '#top-loosers',
        content: getLanguage(getCookies())['tutorial']['overview']['6'],
        highlightedSelectors: ['#top-loosers', '#top-gainers', '#top-volumes'],
    },
    {
        selector: '#last-news',
        content: getLanguage(getCookies())['tutorial']['overview']['7'],
        resizeObservables: ['#last-news'],
    }
];


const stepSignals = [
    {
        selector: '#step-signals-title',
        content: getLanguage(getCookies())['tutorial']['signals']['0'],
        // highlightedSelectors: ['#step-0'],
        // mutationObservables: ['#step-0'],
        // resizeObservables: ['#step-0'],
    },
    {
        selector: '#step-1',
        content: getLanguage(getCookies())['tutorial']['signals']['1'],
        // highlightedSelectors: ['#step-1'],
        // mutationObservables: ['#step-1'],
        // resizeObservables: ['#step-1'],
    },
    {
        selector: '#step-2',
        content: getLanguage(getCookies())['tutorial']['signals']['2'],
        // highlightedSelectors: ['#step-2'],
        // mutationObservables: ['#step-2'],
        // resizeObservables: ['#step-2'],
    },
    {
        selector: '#step-3',
        content: getLanguage(getCookies())['tutorial']['signals']['3'],
        // highlightedSelectors: ['#step-3'],
        // mutationObservables: ['#step-3'],
        // resizeObservables: ['#step-3'],
    },
    {
        selector: '#step-4',
        content: getLanguage(getCookies())['tutorial']['signals']['4'],
        // highlightedSelectors: ['#step-4'],
        // mutationObservables: ['#step-4'],
        // resizeObservables: ['#step-4'],
    },
    {
        selector: '#step-5',
        content: getLanguage(getCookies())['tutorial']['signals']['5'],
        // highlightedSelectors: ['#step-5'],
        // mutationObservables: ['#step-5'],
        // resizeObservables: ['#step-5'],
    },
    {
        selector: '#step-6',
        content: getLanguage(getCookies())['tutorial']['signals']['6'],
        // highlightedSelectors: ['#step-6'],
        // mutationObservables: ['#step-6'],
        // resizeObservables: ['#step-6'],
    },
    {
        selector: '#step-7',
        content: getLanguage(getCookies())['tutorial']['signals']['7'],
        // highlightedSelectors: ['#step-7'],
        // mutationObservables: ['#step-7'],
        // resizeObservables: ['#step-7'],
    },
    {
        selector: '#step-8',
        content: getLanguage(getCookies())['tutorial']['signals']['8'],
        // highlightedSelectors: ['#step-8'],
        // mutationObservables: ['#step-8'],
        // resizeObservables: ['#step-8'],
    },
    {
        selector: '#step-9',
        content: getLanguage(getCookies())['tutorial']['signals']['9'],
        // highlightedSelectors: ['#step-9'],
        // mutationObservables: ['#step-9'],
        // resizeObservables: ['#step-9'],
    },
];


const stepDashboard = [
    {
        selector: '#step-dashboard-title',
        content: getLanguage(getCookies())['tutorial']['dashboard']['0'],
        // highlightedSelectors: ['#step-0'],
        // mutationObservables: ['#step-0'],
        // resizeObservables: ['#step-0'],
    },
    {
        selector: '#step-1',
        content: getLanguage(getCookies())['tutorial']['dashboard']['1'],
        // highlightedSelectors: ['#step-1'],
        // mutationObservables: ['#step-1'],
        // resizeObservables: ['#step-1'],
    },
    {
        selector: '#step-2',
        content: getLanguage(getCookies())['tutorial']['dashboard']['2'],
        // highlightedSelectors: ['#step-2'],
        // mutationObservables: ['#step-2'],
        // resizeObservables: ['#step-2'],
    },
    {
        selector: '#step-3',
        content: getLanguage(getCookies())['tutorial']['dashboard']['3'],
        // highlightedSelectors: ['#step-3'],
        // mutationObservables: ['#step-3'],
        // resizeObservables: ['#step-3'],
    },
    {
        selector: '#step-4',
        content: getLanguage(getCookies())['tutorial']['dashboard']['4'],
        // highlightedSelectors: ['#step-4'],
        // mutationObservables: ['#step-4'],
        // resizeObservables: ['#step-4'],
    },
    {
        selector: '#step-5',
        content: getLanguage(getCookies())['tutorial']['dashboard']['5'],
        // highlightedSelectors: ['#step-5'],
        // mutationObservables: ['#step-5'],
        // resizeObservables: ['#step-5'],
    },
    {
        selector: '#step-6',
        content: getLanguage(getCookies())['tutorial']['dashboard']['6'],
        // highlightedSelectors: ['#step-6'],
        // mutationObservables: ['#step-6'],
        // resizeObservables: ['#step-6'],
    },
    {
        selector: '#step-7',
        content: getLanguage(getCookies())['tutorial']['dashboard']['7'],
        // highlightedSelectors: ['#step-7'],
        // mutationObservables: ['#step-7'],
        // resizeObservables: ['#step-7'],
    },
    {
        selector: '#step-8',
        content: getLanguage(getCookies())['tutorial']['dashboard']['8'],
        // highlightedSelectors: ['#step-8'],
        // mutationObservables: ['#step-8'],
        // resizeObservables: ['#step-8'],
    },
    {
        selector: '#step-9',
        content: getLanguage(getCookies())['tutorial']['dashboard']['9'],
        // highlightedSelectors: ['#step-9'],
        // mutationObservables: ['#step-9'],
        // resizeObservables: ['#step-9'],
    },
];


const stepTrendAndNews = [
    {
        selector: '#step-news-title',
        content: getLanguage(getCookies())['tutorial']['trend-and-news']['0'],
        // highlightedSelectors: ['#step-0'],
        // mutationObservables: ['#step-0'],
        // resizeObservables: ['#step-0'],
    },
    {
        selector: '#news-panel-0',
        content: getLanguage(getCookies())['tutorial']['trend-and-news']['1'],
        // highlightedSelectors: ['#step-1'],
        // mutationObservables: ['#step-1'],
        // resizeObservables: ['#step-1'],
    },
    {
        selector: '#news-panel-1',
        content: getLanguage(getCookies())['tutorial']['trend-and-news']['2'],
        // highlightedSelectors: ['#step-2'],
        // mutationObservables: ['#step-2'],
        // resizeObservables: ['#step-2'],
    },
    {
        selector: '#news-panel-2',
        content: getLanguage(getCookies())['tutorial']['trend-and-news']['3'],
        // highlightedSelectors: ['#step-3'],
        // mutationObservables: ['#step-3'],
        // resizeObservables: ['#step-3'],
    },
    {
        selector: '#step-4',
        content: getLanguage(getCookies())['tutorial']['trend-and-news']['4'],
        // highlightedSelectors: ['#step-4'],
        // mutationObservables: ['#step-4'],
        // resizeObservables: ['#step-4'],
    },
    {
        selector: '#step-5',
        content: getLanguage(getCookies())['tutorial']['trend-and-news']['5'],
        // highlightedSelectors: ['#step-5'],
        // mutationObservables: ['#step-5'],
        // resizeObservables: ['#step-5'],
    },
    {
        selector: '#step-6',
        content: getLanguage(getCookies())['tutorial']['trend-and-news']['6'],
        // highlightedSelectors: ['#step-6'],
        // mutationObservables: ['#step-6'],
        // resizeObservables: ['#step-6'],
    },
    {
        selector: '#step-7',
        content: getLanguage(getCookies())['tutorial']['trend-and-news']['7'],
        // highlightedSelectors: ['#step-7'],
        // mutationObservables: ['#step-7'],
        // resizeObservables: ['#step-7'],
    },
    {
        selector: '#step-8',
        content: getLanguage(getCookies())['tutorial']['trend-and-news']['8'],
        // highlightedSelectors: ['#step-8'],
        // mutationObservables: ['#step-8'],
        // resizeObservables: ['#step-8'],
    },
    {
        selector: '#step-9',
        content: getLanguage(getCookies())['tutorial']['trend-and-news']['9'],
        // highlightedSelectors: ['#step-9'],
        // mutationObservables: ['#step-9'],
        // resizeObservables: ['#step-9'],
    },
];

const stepWallet = [
    {
        selector: '#step-wallet-title',
        content: getLanguage(getCookies())['tutorial']['wallet']['0'],
        // highlightedSelectors: ['#step-0'],
        // mutationObservables: ['#step-0'],
        // resizeObservables: ['#step-0'],
    },
    {
        selector: '#step-1',
        content: getLanguage(getCookies())['tutorial']['wallet']['1'],
        // highlightedSelectors: ['#step-1'],
        // mutationObservables: ['#step-1'],
        // resizeObservables: ['#step-1'],
    },
    {
        selector: '#step-2',
        content: getLanguage(getCookies())['tutorial']['wallet']['2'],
        // highlightedSelectors: ['#step-2'],
        // mutationObservables: ['#step-2'],
        // resizeObservables: ['#step-2'],
    },
    {
        selector: '#step-3',
        content: getLanguage(getCookies())['tutorial']['wallet']['3'],
        // highlightedSelectors: ['#step-3'],
        // mutationObservables: ['#step-3'],
        // resizeObservables: ['#step-3'],
    },
    {
        selector: '#step-4',
        content: getLanguage(getCookies())['tutorial']['wallet']['4'],
        // highlightedSelectors: ['#step-4'],
        // mutationObservables: ['#step-4'],
        // resizeObservables: ['#step-4'],
    },
    {
        selector: '#step-5',
        content: getLanguage(getCookies())['tutorial']['wallet']['5'],
        // highlightedSelectors: ['#step-5'],
        // mutationObservables: ['#step-5'],
        // resizeObservables: ['#step-5'],
    },
    {
        selector: '#step-6',
        content: getLanguage(getCookies())['tutorial']['wallet']['6'],
        // highlightedSelectors: ['#step-6'],
        // mutationObservables: ['#step-6'],
        // resizeObservables: ['#step-6'],
    },
    {
        selector: '#step-7',
        content: getLanguage(getCookies())['tutorial']['wallet']['7'],
        // highlightedSelectors: ['#step-7'],
        // mutationObservables: ['#step-7'],
        // resizeObservables: ['#step-7'],
    },
    {
        selector: '#step-8',
        content: getLanguage(getCookies())['tutorial']['wallet']['8'],
        // highlightedSelectors: ['#step-8'],
        // mutationObservables: ['#step-8'],
        // resizeObservables: ['#step-8'],
    },
    {
        selector: '#step-9',
        content: getLanguage(getCookies())['tutorial']['wallet']['9'],
        // highlightedSelectors: ['#step-9'],
        // mutationObservables: ['#step-9'],
        // resizeObservables: ['#step-9'],
    },
];


const stepsSettings = [
    {
        selector: '#edit-user-pic',
        content: getLanguage(getCookies())['tutorial']['settings']['0'],
    },
    {
        selector: '.edit-icon',
        content: getLanguage(getCookies())['tutorial']['settings']['1'],
    },
    {
        selector: '#user-wallet',
        content: getLanguage(getCookies())['tutorial']['settings']['2'],
    },
    {
        selector: '#user-notify-bots',
        content: getLanguage(getCookies())['tutorial']['settings']['3'],
    },
    {
        selector: '#change-password',
        content: getLanguage(getCookies())['tutorial']['settings']['4'],
        highlightedSelectors: ['.container'],
        mutationObservables: ['.container'],
        resizeObservables: ['.container'],
    },
    {
        selector: '.enabled-mfa-app-text',
        content: getLanguage(getCookies())['tutorial']['settings']['5'],
    },
    {
        selector: '#mfa-code-trigger-button',
        content: getLanguage(getCookies())['tutorial']['settings']['6'],
        highlightedSelectors: ['#mfa-code-img-tag'],
        mutationObservables: ['#mfa-code-img-tag'],
        resizeObservables: ['#mfa-code-img-tag'],
    },
];


const stepsSettingsWithoutMfa = [
    {
        selector: '#edit-user-pic',
        content: getLanguage(getCookies())['tutorial']['settings']['0'],
    },
    {
        selector: '.edit-icon',
        content: getLanguage(getCookies())['tutorial']['settings']['1'],
    },
    {
        selector: '#user-wallet',
        content: getLanguage(getCookies())['tutorial']['settings']['2'],
    },
    {
        selector: '#user-notify-bots',
        content: getLanguage(getCookies())['tutorial']['settings']['3'],
    },
    {
        selector: '#change-password',
        content: getLanguage(getCookies())['tutorial']['settings']['4'],
        highlightedSelectors: ['.container'],
        mutationObservables: ['.container'],
        resizeObservables: ['.container'],
    },
    {
        selector: '.enabled-mfa-app-text',
        content: getLanguage(getCookies())['tutorial']['settings']['5'],
    },
];


// const stepExample = [
//     {
//         selector: '#step-0',
//         content: localStorage.getItem('language') ? getLanguage(localStorage.getItem('language').replace('-', ''))['tutorial']['example']['0'] : getLanguage('en-US')['example']['signals']['0'],
//         // highlightedSelectors: ['#step-0'],
//         // mutationObservables: ['#step-0'],
//         // resizeObservables: ['#step-0'],
//     },
//     {
//         selector: '#step-1',
//         content: localStorage.getItem('language') ? getLanguage(localStorage.getItem('language').replace('-', ''))['tutorial']['example']['1'] : getLanguage('en-US')['example']['signals']['1'],
//         // highlightedSelectors: ['#step-1'],
//         // mutationObservables: ['#step-1'],
//         // resizeObservables: ['#step-1'],
//     },
//     {
//         selector: '#step-2',
//         content: localStorage.getItem('language') ? getLanguage(localStorage.getItem('language').replace('-', ''))['tutorial']['example']['2'] : getLanguage('en-US')['example']['signals']['2'],
//         // highlightedSelectors: ['#step-2'],
//         // mutationObservables: ['#step-2'],
//         // resizeObservables: ['#step-2'],
//     },
//     {
//         selector: '#step-3',
//         content: localStorage.getItem('language') ? getLanguage(localStorage.getItem('language').replace('-', ''))['tutorial']['example']['3'] : getLanguage('en-US')['example']['signals']['3'],
//         // highlightedSelectors: ['#step-3'],
//         // mutationObservables: ['#step-3'],
//         // resizeObservables: ['#step-3'],
//     },
//     {
//         selector: '#step-4',
//         content: localStorage.getItem('language') ? getLanguage(localStorage.getItem('language').replace('-', ''))['tutorial']['example']['4'] : getLanguage('en-US')['example']['signals']['4'],
//         // highlightedSelectors: ['#step-4'],
//         // mutationObservables: ['#step-4'],
//         // resizeObservables: ['#step-4'],
//     },
//     {
//         selector: '#step-5',
//         content: localStorage.getItem('language') ? getLanguage(localStorage.getItem('language').replace('-', ''))['tutorial']['example']['5'] : getLanguage('en-US')['example']['signals']['5'],
//         // highlightedSelectors: ['#step-5'],
//         // mutationObservables: ['#step-5'],
//         // resizeObservables: ['#step-5'],
//     },
//     {
//         selector: '#step-6',
//         content: localStorage.getItem('language') ? getLanguage(localStorage.getItem('language').replace('-', ''))['tutorial']['example']['6'] : getLanguage('en-US')['example']['signals']['6'],
//         // highlightedSelectors: ['#step-6'],
//         // mutationObservables: ['#step-6'],
//         // resizeObservables: ['#step-6'],
//     },
//     {
//         selector: '#step-7',
//         content: localStorage.getItem('language') ? getLanguage(localStorage.getItem('language').replace('-', ''))['tutorial']['example']['7'] : getLanguage('en-US')['example']['signals']['7'],
//         // highlightedSelectors: ['#step-7'],
//         // mutationObservables: ['#step-7'],
//         // resizeObservables: ['#step-7'],
//     },
//     {
//         selector: '#step-8',
//         content: localStorage.getItem('language') ? getLanguage(localStorage.getItem('language').replace('-', ''))['tutorial']['example']['8'] : getLanguage('en-US')['example']['signals']['8'],
//         // highlightedSelectors: ['#step-8'],
//         // mutationObservables: ['#step-8'],
//         // resizeObservables: ['#step-8'],
//     },
//     {
//         selector: '#step-9',
//         content: localStorage.getItem('language') ? getLanguage(localStorage.getItem('language').replace('-', ''))['tutorial']['example']['9'] : getLanguage('en-US')['example']['signals']['9'],
//         // highlightedSelectors: ['#step-9'],
//         // mutationObservables: ['#step-9'],
//         // resizeObservables: ['#step-9'],
//     },
// ];


export { 
    stepsOverview,
    stepSignals,
    stepDashboard,
    stepTrendAndNews,
    stepWallet,
    stepsSettings,
    stepsSettingsWithoutMfa
};
