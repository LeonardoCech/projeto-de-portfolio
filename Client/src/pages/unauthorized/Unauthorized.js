import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import i18n from 'locales/i18n';

import { Column, Panel, Row } from 'components/imports';

import { getLanguage, getTheme } from 'utils/cookies';

import { defaults } from 'constants';

import './Unauthorized.css';


const Unauthorized = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const pageId = 'unauthorized';


    useEffect(() => {
        changeLanguage();
        changeTheme();
    }, []);


    useEffect(() => {

        if (location.pathname === `/${pageId}`) {
            document.title = `${t('api_codes.default.401_page')} - Minhas Finanças`;

            let $body = document.body.classList;
            $body.remove(...$body);
            $body.add('not-found-page');

            changeLanguage();
            changeTheme();

            const intervalId = setInterval(() => {
                navigate('/sign-in');
            }, defaults.redirectTime.unauthorized);

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
            <Panel id='not-found-panel-browser'>
                <Column>
                    <Row fill='width' j='center'>
                        <h1>401</h1>
                    </Row>

                    <Row fill='width' j='center'>
                        <h3>{t('api_codes.default.401_page')}</h3>
                    </Row>

                    <Row>
                        <p>{t('sign-in-redirect')}</p>
                    </Row>

                    <Row fill='width' j='center'>
                        <button
                            className='secondary'
                            onClick={() => navigate('/sign-in')}
                        >
                            <p>{t('go-to.sign-in')}</p>
                        </button>
                    </Row>
                </Column>
            </Panel>
        </div>
    );
};

export default Unauthorized;
