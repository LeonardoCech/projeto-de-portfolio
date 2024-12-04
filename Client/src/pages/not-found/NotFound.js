import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import i18n from 'locales/i18n';

import { Column, Panel, Row } from 'components/imports';

import { getLanguage, getTheme } from 'utils/cookies';

import { defaults } from 'constants';

import './NotFound.css';


const NotFound = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const pageId = 'not-found';

    const lastVisitedPage = localStorage.getItem('lastVisitedPage');


    useEffect(() => {
        changeLanguage();
        changeTheme();
    }, []);


    useEffect(() => {

        if (location.pathname === `/${pageId}`) {
            document.title = `${t('api_codes.default.404_page')} - Minhas Finanças`;

            let $body = document.body.classList;
            $body.remove(...$body);
            $body.add('not-found-page');

            changeLanguage();
            changeTheme();

            const intervalId = setInterval(() => {

                if (lastVisitedPage) {
                    // Redirecione o usuário para a última página visitada
                    navigate(lastVisitedPage);
                }

            }, defaults.redirectTime.notFound);

            return () => clearInterval(intervalId);
        }

    }, [location.pathname]);


    const changeLanguage = () => {
        i18n.changeLanguage(getLanguage());
    };

    const changeTheme = () => {
        document.body.classList.remove('dark');
        document.body.classList.remove('bright');
        document.body.classList.add(getTheme());
    };


    return (
        <div id='not-found-page-base'>
            <Panel id='not-found-panel'>
                <Column>
                    <Row fill='width' j='center'>
                        <h1>404</h1>
                    </Row>
                    <Row fill='width' j='center'>
                        <h3>{t('api_codes.default.404_page')}</h3>
                    </Row>
                    <Row>
                        <p>{t('go-back')}</p>
                    </Row>
                    <Row fill='width' j='center'>
                        <button
                            className='secondary'
                            onClick={() => navigate(lastVisitedPage)}
                        >
                            <p>{t('click-if-not-works')}</p>
                        </button>
                    </Row>
                </Column>
            </Panel>
        </div>
    );
};


export default NotFound;
