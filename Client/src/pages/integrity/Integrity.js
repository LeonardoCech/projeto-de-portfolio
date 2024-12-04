import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import i18n from 'locales/i18n';
import $ from 'jquery';

import { useTranslation } from 'react-i18next';

import { MinhasFinancasPPLogoSvg, BgAuthentication } from 'images/imports';

import { usersMeGet, sessionsTempGet, sessionsMeMfaGet, sessionsMeTempMfaGet } from 'apis/imports';

import { Layout, Loading, MessagePopup, Page, Panel, Row } from 'components/imports';
import { Button, Column, Input, Link, Title } from 'components/imports';

// Utils
import { getLanguage, getTheme } from 'utils/cookies';
import { pageLoaded } from 'utils/pages';


import './Integrity.css';


const Integrity = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const { t } = useTranslation();

    const pageId = 'integrity';
    const [appLang,] = useState(getLanguage());
    const [appTheme,] = useState(getTheme());

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [lastMfaCode, setLastMfaCode] = useState('');

    const popUpDefaultDuration = 5000;

    const [popUpLevel, setPopUpLevel] = useState('warning');
    const [popUpText, setPopUpText] = useState('-');
    const [popUpDuration, setPopUpDuration] = useState(popUpDefaultDuration);

    const [tempTokenButtonState, setTempTokenButtonState] = useState('enabled');
    const [verifyButtonState, setVerifyButtonState] = useState('enabled');

    const [mfaCode, setMfaCode] = useState(Array(6).fill(''));

    // const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {

        if (location.pathname === `/${pageId}`) {
            $('.integrity').hide();

            $('#recaptcha-container').hide();

            setUsername(location.state && 'username' in location.state ? location.state.username : '');

            if (location.state && !('forgotPassword' in location.state)) {
                $('#insert-email-form').hide();
                $('#go-back-link').hide();
                $('#send-email').show();
                getUser();
            } else {
                $('#insert-code-form').hide();
                $('#go-back-link').hide();
                $('#send-email').hide();
                pageLoaded(pageId);
            }
        }
    }, [location.pathname]);


    useEffect(() => {
        document.body.classList.remove('bright', 'dark');
        document.body.classList.add(appTheme);
        i18n.changeLanguage(appLang);
    }, [appTheme, appLang]);


    useEffect(() => {
        var emailRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/;
        if (username === '') setValidUsername(false);
        else setValidUsername(emailRegex.test(username));
    }, [username]);


    const getUser = async () => {

        let { access_token, token_type } = location.state;

        const result = await usersMeGet(`${token_type} ${access_token}`);

        if (result.isSuccess && 'response' in result) {
            pageLoaded(pageId);
        }
    };


    const handleSignInLink = () => {
        // setIsLeaving(true);
        // navigate('/sign-in', 1000);
        navigate('/sign-in');
    };


    const handleGoBackLink = () => {
        $('#insert-code-form').hide();
        $('#go-back-link').hide();
        $('#sign-in-link').show();
        $('#insert-email-form').fadeIn();
    };


    const handleUsernameChange = event => {
        setUsername(event.target.value);
    };


    const handleSendEmail = async event => {

        event.preventDefault();

        setTempTokenButtonState('loading');

        const tempTokenResult = await sessionsTempGet({
            email: username
        });

        if (tempTokenResult.isSuccess) {
            setTempTokenButtonState('success');

            $('#insert-email-form').hide();
            $('#sign-in-link').hide();
            $('#go-back-link').show();
            $('#insert-code-form').fadeIn();
        }
    };


    const handleSubmit = async event => {

        event.preventDefault();

        for (let i = 0; i < 6; i++) {
            var $input = $(`input[name='digit-${i}']`);
            if (($input.val() ?? '').length === 0) $input.addClass('required');
            else $input.removeClass('required');
        }

        const forgotPassword = 'forgotPassword' in location.state && location.state.forgotPassword;
        var oauthmfa = $('#oauth-input-result').val();
        var mfa_type = 'TOTP';


        if (oauthmfa === '') {
            setVerifyButtonState('error');
            setPopUpText(t('insert-code'));
            return;
        }

        // Validations to avoid unecessary API calls
        if (oauthmfa.length !== 6) {
            setVerifyButtonState('error');
            setPopUpText(t('insert-digits'));
            return;
        }
        if (oauthmfa === lastMfaCode) {
            setVerifyButtonState('error');
            setPopUpText(t('invalid-code'));
            return;
        }

        setLastMfaCode(oauthmfa);
        setVerifyButtonState('loading');

        let result;

        if (forgotPassword) {
            result = await sessionsMeTempMfaGet({
                oauthmfa,
                mfa_type
            });

        }
        else {
            result = await sessionsMeMfaGet({
                oauthmfa,
                mfa_type
            });
        }

        $('form #check-code-button').css('cursor', 'pointer');
        if (result.isSuccess) {

            setVerifyButtonState('success');

            localStorage.removeItem('lastMfaSentAt');

            let delayToRedirect = 1000;

            setPopUpText(t('redirect-overview'));
            setPopUpLevel('success');
            setPopUpDuration(delayToRedirect);

            if (forgotPassword) setTimeout(() => navigate('/reset-password'), delayToRedirect);
            else setTimeout(() => {
                navigate('/overview', { state: { ...location.state } });
            }, delayToRedirect);
        } else {
            setVerifyButtonState('error');

            let { status, errorType } = result;
            switch (errorType) {
                default:
                    setPopUpText(t(`api_codes.integrity.${status}_0`));
                    break;
            }
            setPopUpLevel('warning');
        }
    };

    useEffect(() => {
        const quickSettings = document.querySelector('.quick-settings');
        const signInPanel = document.querySelector('#integrity-parent');
        
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
        <Page id='integrity-page-base' backgroundImage={BgAuthentication}> {/** className={isLeaving ? 'leaving' : ''} */}

            <div id="background-overlay"></div>

            <Loading id='integrity-loading-overlay' />

            <MessagePopup
                level={popUpLevel}
                text={popUpText}
                duration={popUpDuration}
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
                    <div id='integrity-parent'>
                        <Panel
                            className='integrity browser'
                            id='integrity-panel'
                            j='between'
                            p='ter'
                        >
                            <Row id='sign-in-link'>
                                <Link onClick={handleSignInLink}>{t('go-back-to.sign-in')}</Link>
                            </Row>

                            <Row id='go-back-link'>
                                <Link onClick={handleGoBackLink}>{t('change-email')}</Link>
                            </Row>

                            <Row fill='width' j='center'>
                                <Title variation='secondary' txt={t('do-captcha')} />
                            </Row>

                            <form id='insert-email-form' onSubmit={handleSendEmail} autoComplete='off'>
                                <Row>
                                    <p>{t('mfa-email-hint')}</p>
                                </Row>

                                <Row fill='width'>
                                    <Input id='send-email-input' onChange={handleUsernameChange} placeholder={t('username.s')} variation='email' value={username} />
                                </Row>

                                <Row fill='width'>
                                    <Button
                                        className='fill-width'
                                        disabled={!validUsername}
                                        id='send-email-button'
                                        state={tempTokenButtonState}
                                        type='submit'
                                    >{t('continue')}</Button>
                                </Row>
                            </form>

                            <form id='insert-code-form' onSubmit={handleSubmit}>
                                <Column fill='width'>
                                    <p id='verification-message'>{t('validate-auth-smartphone-code').replace('{username}', username)}</p>
                                </Column>

                                <Row fill='width'>
                                    <Input
                                        code={mfaCode}
                                        id='oauth-input'
                                        setCode={setMfaCode}
                                        variation='mfa-code'
                                    />
                                </Row>

                                <Row fill='width' j='center'>
                                    <Button
                                        className='fill-width'
                                        id='check-code-button'
                                        state={verifyButtonState}
                                        type='submit'
                                    >{t('verify.v')}</Button>
                                </Row>
                            </form>
                        </Panel>
                    </div>
                </Column>
            </Layout>
        </Page>
    );
};

export default Integrity;