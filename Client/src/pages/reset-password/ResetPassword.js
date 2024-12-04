
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import i18n from 'locales/i18n';
import $ from 'jquery';

import { useTranslation } from 'react-i18next';

import { MinhasFinancasPPLogoSvg, BgAuthentication } from 'images/imports';

import { Tooltip } from 'antd';

import { Loading, MessagePopup } from 'components/imports';
import { InfoSvg } from 'icons/imports';
import { serverConstantsGet, usersMeCredentialsPatch } from 'apis/imports';

import { Column, Layout, Page, Panel, Row } from 'components/imports';
import { Bar, Button, Input, Link, Title } from 'components/imports';

// Utils
import { getLanguage, getTheme } from 'utils/cookies';
import { passwordVerify } from 'utils/passwords';

import './ResetPassword.css';
import './ResetPasswordBrowser.css';
import './ResetPasswordMobile.css';


const ResetPassword = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const { t } = useTranslation();

    const pageId = 'reset-password';
    const [appLang,] = useState(getLanguage());
    const [appTheme,] = useState(getTheme());

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const $password = $('#reset--password-input');
    const $confirmPassword = $('#reset--confirm-password-input');

    // From MessagePopup component
    const [popUpLevel, setPopUpLevel] = useState('warning');
    const [popUpText, setPopUpText] = useState('-');
    const [popUpDuration, setPopUpDuration] = useState(3500);

    const [userServiceConstants, setUserServiceConstants] = useState({});

    const infoIcon = <InfoSvg className='icon-svg'></InfoSvg>;

    const [progressBar, setProgressBar] = useState(0);

    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

    const [saveButtonState, setSaveButtonState] = useState('enabled');

    // const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {

        if (location.pathname === `/${pageId}`) {
            document.title = `${t('password-reset')} - Minhas Finanças`;

            const result = serverConstantsGet();

            if (result.isSuccess) setUserServiceConstants(result.response);
            else {
                setUserServiceConstants({
                    'UserModel': {
                        'fullname': {
                            'length': {
                                'max': 32,
                                'min': 4
                            }
                        },
                        'password': {
                            'length': {
                                'max': 30,
                                'min': 8
                            }
                        }
                    }
                });
            }

            // Esconde o elemento que apresenta o QR Code de MFA, pois o campo de email precisa estar preenchido corretamente para que ele apareça
            $('#mobile-imgs img').hide();

            const handleLoad = () => $('.loading-overlay').fadeOut();
            if (document.readyState === 'complete') handleLoad();
            else window.addEventListener('load', handleLoad);
        }

    }, [location.pathname]);


    useEffect(() => {
        document.body.classList.remove('bright', 'dark');
        document.body.classList.add(appTheme);
        i18n.changeLanguage(appLang);
    }, [appTheme, appLang]);


    useEffect(() => {

        $password.removeClass('required');
        setPassword(password);

        let $hintText = $('.password-hints');

        if ('UserModel' in userServiceConstants) {

            let passwordMinLength = userServiceConstants.UserModel.password.length.min,
                passwordMaxLength = userServiceConstants.UserModel.password.length.max;

            const result = passwordVerify({
                value: password,
                passwordMinLength: passwordMinLength,
                passwordMaxLength: passwordMaxLength,
                message: 'password.required',
            });

            let { barWidth, strongPass, message } = result;

            if (t(message).includes('{}')) {

                if (password.length < passwordMinLength) {
                    message = t(message).replace('{}', passwordMinLength);
                } else {
                    message = t(message).replace('{}', passwordMaxLength);
                }
            }

            $hintText.text(t(message));

            if (confirmPassword.length > 0) {

                $confirmPassword.removeClass('required');

                if (password !== confirmPassword) setIsPasswordValid(false);
                else setIsPasswordValid(strongPass && password === confirmPassword);
            }
            else setIsPasswordValid(false);

            setProgressBar(barWidth * 10);
        }

    }, [password, confirmPassword]);


    useEffect(() => {
        setSaveButtonState(isPasswordValid ? 'enabled' : 'disabled');
    }, [isPasswordValid]);


    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        $password.removeClass('required');
    };


    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        $confirmPassword.removeClass('required');
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (password === '') $password.addClass('required');
        else $password.removeClass('required');

        setSaveButtonState('loading');

        const result = await usersMeCredentialsPatch({
            password
        });

        let { isSuccess, status, errorType } = result;

        $('button[type=submit]').css('cursor', 'pointer');

        if (isSuccess) {
            setSaveButtonState('success');

            setPopUpLevel('success');
            setPopUpText(t('api_codes.reset-password.200_0'));
            setPopUpDuration(2000);

            setTimeout(() => navigate('/sign-in'), 2000);
        }
        else {
            setSaveButtonState('error');


            switch (errorType) {
                case 'AlreadyExistsError':
                    setPopUpText(t(`api_codes.reset-password.${status}_1`));
                    break;
                default:
                    setPopUpText(t(`api_codes.default.${status}_0`));
                    break;
            }
            setPopUpLevel('warning');
            setPopUpDuration(3500);
        }
    };

    useEffect(() => {
        const quickSettings = document.querySelector('.quick-settings');
        const signInPanel = document.querySelector('#reset-password-parent');
        
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
        <Page id='reset-password-page-base' backgroundImage={BgAuthentication}> {/** className={isLeaving ? 'leaving' : ''} */}

            <div id="background-overlay"></div>

            <Loading id={'reset-password-loading-overlay'} />

            <MessagePopup
                duration={popUpDuration}
                level={popUpLevel}
                text={popUpText}
            />

            <Layout
                checkAuth={true}
                page={pageId}
                showVersion={true}
            >
                <img id='minhas-financas-logo' src={MinhasFinancasPPLogoSvg} />

                <Column
                    a='center'
                    fill='all'
                    j='center'
                >
                    <div id='reset-password-parent'>
                        <Panel
                            className='browser'
                            id='reset-password-panel'
                            g='2'
                            j='between'
                            p='ter'
                        >

                            <Row id='sign-in-link'>
                                <Link onClick={() => {
                                    let result = confirm(t('are-you-sure'));
                                    if (result) {
                                        // setIsLeaving(true);
                                        // navigate('/sign-in', 1000);
                                        navigate('/sign-in');
                                    }
                                }}>{t('go-back-to.sign-in')}</Link>
                            </Row>

                            <Row fill='width' j='center'>
                                <Title variation='secondary' txt={t('password.reset')} />
                            </Row>

                            <form
                                className='steps-flow-step'
                                name='insert-password'
                                id='reset-password-form'
                                onSubmit={handleSubmit}
                            >
                                <p>{t('insert-password')}</p>

                                <Input
                                    id='reset--password-input'
                                    onChange={handlePasswordChange}
                                    placeholder={t('password.s')}
                                    variation='password'
                                    value={password}
                                />

                                <Input
                                    id='reset--confirm-password-input'
                                    onChange={handleConfirmPasswordChange}
                                    placeholder={t('password.confirm')}
                                    variation='password'
                                    value={confirmPassword}
                                />

                                <Bar progress={progressBar} />

                                <Row>
                                    <Tooltip
                                        color='#1D96EE'
                                        open={showPasswordRequirements}
                                        title={
                                            <span>
                                                {t('password.hints.0')}<br />
                                                {t('password.hints.1')}<br />
                                                {t('password.hints.2')}<br />
                                                {t('password.hints.3')}<br />
                                                {t('password.hints.4')}<br />
                                                {t('password.hints.5')}<br />
                                                {t('password.hints.6')}<br />
                                            </span>
                                        }
                                    >
                                        <Row id='icon-container' onClick={() => setShowPasswordRequirements(!showPasswordRequirements)}>
                                            {infoIcon}
                                        </Row>
                                    </Tooltip>

                                    <p className='password-hints'>{t('password.required')}</p>
                                </Row>

                                <Row fill='width' j='between'>
                                    <b id='password-msg'>
                                        {confirmPassword.length > 0 && password !== confirmPassword ? t('password.mismatch') : ''}
                                    </b>

                                    <Button
                                        id='step-1-0-btn-send'
                                        className='primary'
                                        name='insert-password'
                                        state={saveButtonState}
                                        type='submit'
                                    >{t('save')}</Button>
                                </Row>
                            </form>
                        </Panel>
                    </div>
                </Column>
            </Layout>
        </Page >
    );
};

export default ResetPassword;
