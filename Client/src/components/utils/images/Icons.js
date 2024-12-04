import React from 'react';

import { DeDeFlagSvg, EnUsFlagSvg, EsEsFlagSvg, FrFrFlagSvg, HuHuFlagSvg,
    InInFlagSvg, ItItFlagSvg, JaJpFlagSvg, KoKrFlagSvg, PoPlFlagSvg, PtBrFlagSvg,
    RuRuFlagSvg } from 'icons/imports';


const getFlagIcon = (name, classList) => {

    switch (name) {
        case 'de-DE':
            return <DeDeFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        case 'en-US':
            return <EnUsFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        case 'es-ES':
            return <EsEsFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        case 'fr-FR':
            return <FrFrFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        case 'hu-HU':
            return <HuHuFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        case 'hi-IN':
            return <InInFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        case 'it-IT':
            return <ItItFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        case 'ja-JP':
            return <JaJpFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        case 'ko-KR':
            return <KoKrFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        case 'po-PL':
            return <PoPlFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        case 'pt-BR':
            return <PtBrFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        case 'ru-RU':
            return <RuRuFlagSvg className={'icon-svg ' + classList.join(' ')} />;
        default:
            console.error('Unknown language: ' + name);
            break;
    }
};

export { getFlagIcon };

















