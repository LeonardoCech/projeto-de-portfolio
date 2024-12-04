
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import i18n from 'locales/i18n';
import $ from 'jquery';

import { useTranslation } from 'react-i18next';

import { MinhasFinancasPPLogoSvg, BgAuthentication } from 'images/imports';

import { sessionsMePost } from 'apis/imports';

import { Column, Layout, Page, Panel, Row } from 'components/imports';

import { Button, Input, Link, MessagePopup, Title } from 'components/imports';

import { getLanguage, getTheme } from 'utils/cookies';


import './SignIn.css';


const SignIn = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const { t } = useTranslation();

    const pageId = 'sign-in';
    const [appLang,] = useState(getLanguage());
    const [appTheme,] = useState(getTheme());

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const $username = $('input[type=email]');
    const $password = $('input[type=password]');

    const [popUpLevel, setPopUpLevel] = useState('warning');
    const [popUpText, setPopUpText] = useState('-');
    const [popUpDuration, setPopUpDuration] = useState(5000);

    const [submitButtonState, setSubmitButtonState] = useState('enabled');

    // const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {

        if (location.pathname === `/${pageId}`) {
            document.title = `${t('sign.in.v')} - Minhas Finanças`;

            $('#intro-logo-img').fadeIn();

            if (location?.state?.newSession) {
                setPopUpLevel('warning');
                setPopUpDuration(3500);
                setPopUpText(t('api_codes.default.401_page'));
            }
        }

    }, [location.pathname]);


    useEffect(() => {
        document.body.classList.remove('bright', 'dark');
        document.body.classList.add(appTheme);
        i18n.changeLanguage(appLang);
    }, [appTheme, appLang]);


    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        $username.removeClass('required');
    };


    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        $password.removeClass('required');
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (username === '') $username.addClass('required');
        else $username.removeClass('required');

        if (password === '') $password.addClass('required');
        else $password.removeClass('required');

        if (username === '' || password === '') return;

        setSubmitButtonState('loading');

        const result = await sessionsMePost({
            username,
            password
        });

        if (result.isSuccess) {

            setSubmitButtonState('success');

            let delayToRedirect = 1500;

            setPopUpText(t('api_codes.sign-in.200_0'));
            setPopUpLevel('success');
            setPopUpDuration(delayToRedirect);

            setTimeout(() => {
                navigate('/integrity', { state: { ...result.response, username } });
            }, delayToRedirect);
        }
        else {

            setSubmitButtonState('error');

            let { status, errorType } = result;

            switch (errorType) {
                case 'UserNotFoundError':
                    setPopUpText(t('api_codes.sign-in.404_1'));
                    break;
                case 'NoMFAInformed':
                    setPopUpText(t('api_codes.sign-in.400_1'));
                    break;
                case 'InvalidMFA':
                    setPopUpText(t('api_codes.sign-in.401_1'));
                    break;
                default:
                    setPopUpText(t(`api_codes.sign-in.${status}_0`));
                    break;
            }
            setPopUpLevel('warning');
        }
    };


    const goToSignup = () => setTimeout(() => navigate('/sign-up'));


    useEffect(() => {
        const quickSettings = document.querySelector('.quick-settings');
        const signInPanel = document.querySelector('#sign-in-parent');

        if (quickSettings && signInPanel) {
            signInPanel.insertBefore(quickSettings, signInPanel.firstChild);

            quickSettings.style.position = 'relative';
            quickSettings.style.width = '100%';
            quickSettings.style.marginBottom = 'var(--margin-secondary)';
        }

        return () => {
            const quickSettings = document.querySelector('.quick-settings');
            if (quickSettings) {
                document.querySelector('.layout')?.appendChild(quickSettings);
            }
        };
    }, []);


    return (
        <Page id='sign-in-page-base' backgroundImage={BgAuthentication}>

            <div id="background-overlay"></div>

            <MessagePopup
                duration={popUpDuration}
                level={popUpLevel}
                text={popUpText}
            />

            <Layout
                checkAuth={false}
                page={pageId}
                showVersion={true}
            >
                <img id='minhas-financas-logo' src={MinhasFinancasPPLogoSvg} />

                <Column
                    a='center'
                    fill='all'
                    j='center'
                >
                    <div id='sign-in-parent'>
                        <Panel
                            className='browser'
                            id='sign-in-panel'
                            g='2'
                            j='between'
                            p='ter'
                        >
                            <Row fill='width' g='0'>
                                <p>{t('new-here')}&nbsp;</p>

                                <Link
                                    onClick={() => goToSignup()}
                                >
                                    <p>{t('sign.up.v')}</p>
                                </Link>
                            </Row>

                            <Row fill='width' j='center'>
                                <Title variation='secondary' txt={t('sign.in.v')} />
                            </Row>

                            <form name='sign-in-form' onSubmit={handleSubmit}>
                                <Input
                                    id='username-input'
                                    onChange={handleUsernameChange}
                                    placeholder={t('username.s')}
                                    variation='email'
                                    value={username}
                                />

                                <Input
                                    id='password-input'
                                    onChange={handlePasswordChange}
                                    placeholder={t('password.s')}
                                    variation='password'
                                    value={password}
                                />

                                <Button
                                    className='fill-all'
                                    id='submit-button'
                                    name='sign-in-form'
                                    state={submitButtonState}
                                    type='submit'
                                >{t('sign.in.v')}</Button>
                            </form>

                            <Row a='center' g='0'>
                                <p>{t('password.forgot')}&nbsp;</p>

                                <Link
                                    onClick={() => navigate('/integrity', { state: { forgotPassword: true, username: username } })}
                                >
                                    <p>{t('click-here')}</p>
                                </Link>
                            </Row>
                        </Panel>
                    </div>
                </Column>
            </Layout>
        </Page>
    );
};

export default SignIn;
