/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import $ from 'jquery';

import { useTranslation } from 'react-i18next';

import './CookiesPolicy.css';


function CookiesPolicyModal({ text='-', showDialog=false, handle=(() => {}), handleClickOut=(() => {}) }) {

    const { t } = useTranslation();

    useEffect(() => {
        if (showDialog) $('.cookies-dialog').show();
        else $('.cookies-dialog').hide();
    }, [showDialog]);

    return (
        <div className='cookies-dialog cookies-modal' onClick={handleClickOut}>
            <div className='container'>
                <div>
                    <p className='cookies-title'>{t('cookies.messages.title')}</p>
                    <p>{t(text)}</p>
                </div>
                <span>
                    <button id='no-btn' className='secondary' onClick={handle}>{t('cookies.learn-more')}</button>
                    <button id='yes-btn' className='primary' onClick={handle}>{t('cookies.i-agree')}</button>
                </span>
            </div>
        </div>
    );
}

export default CookiesPolicyModal;
