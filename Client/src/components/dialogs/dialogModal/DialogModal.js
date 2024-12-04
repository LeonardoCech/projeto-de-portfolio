/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import $ from 'jquery';

import { useTranslation } from 'react-i18next';

import './DialogModal.css';


function DialogModal({ text='-', showDialog=false, handle=(() => {}), handleClickOut=(() => {}) }) {

    const { t } = useTranslation();

    useEffect(() => {
        if (showDialog) $('.accept-dialog').show();
        else $('.accept-dialog').hide();
    }, [showDialog]);

    return (
        <div className='accept-dialog modal' onClick={handleClickOut}>
            <div className='container'>
                <h3>{t('attention')}</h3>
                <p>{t(text)}</p>
                <span>
                    <button id='no-btn' className='secondary' onClick={handle}>{t('cancel')}</button>
                    <button id='yes-btn' className='primary' onClick={handle}>{t('accept')}</button>
                </span>
            </div>
        </div>
    );
}

export default DialogModal;
