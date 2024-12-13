import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import $ from 'jquery';

import { useTranslation } from 'react-i18next';
import i18n from 'locales/i18n';

import { InfoSvg, LoadingImg } from 'icons/imports';
import { MinhasFinancasPPLogoSvg, BgAuthentication } from 'images/imports';

import { Page, Column, Layout, MessagePopup, Panel, Row, StepsFlow } from 'components/imports';
import { Bar, Button, Input, Link, Title } from 'components/imports';

import { emailsPost, qrCodesOpenGetEndpoint, sessionsMeTempMfaGet, sessionsTempGet, usersMePost } from 'apis/imports';

import ReadDoc from 'pages/sign-up/components/read-doc/ReadDoc';
import UserCard from 'pages/sign-up/components/user-card/UserCard';

import { Tooltip } from 'antd';

// Utils
import { getLanguage, getTheme } from 'utils/cookies';
import { passwordVerify } from 'utils/passwords';

import './SignUp.css';
import { termsOfServiceDoc, privacyPolicyDoc } from 'constants';


const SignUp = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const { t } = useTranslation();

    const pageId = 'sign-up';
    const [appLang,] = useState(getLanguage());
    const [appTheme,] = useState(getTheme());

    const [tempToken, setTempToken] = useState('');

    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tel, setTel] = useState('');

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isEmailMfaValid, setIsEmailMfaValid] = useState(false);
    const [isSmartphoneMfaValid, setIsSmartphoneMfaValid] = useState(false);
    const [isTermsOfServiceAccepted, setIsTermsOfServiceAccepted] = useState(false);
    const [isPrivacyPolicyAccepted, setIsPrivacyPolicyAccepted] = useState(false);

    const $userCard = $('#user-card-div');
    const $fullname = $('#sign-up-fullname-input');
    const $username = $('#sign-up-username-input');
    const $password = $('#sign-up-password-input');
    const $confirmPassword = $('#sign-up-confirm-password-input');
    const $tel = $('input[type=tel]');

    // From MessagePopup component
    const [popUpLevel, setPopUpLevel] = useState('warning');
    const [popUpText, setPopUpText] = useState('-');
    const [popUpDuration, setPopUpDuration] = useState(5000);

    const [userServiceConstants, setUserServiceConstants] = useState({});

    const infoIcon = <InfoSvg className='icon-svg yes'></InfoSvg>;

    const [mfaQRCode, setMfaQRCode] = useState();

    const [progressBar, setProgressBar] = useState(0);

    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

    // const [isLeaving, setIsLeaving] = useState(false);

    const steps = [
        t('validate-email'),
        t('validate-password'),
        t('multi-factor-smartphone'),
        t('agree-to-our-policy')
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [currentSubstep, setCurrentSubstep] = useState(0);
    const [lastSubstepsPerStep, setlastSubstepsPerStep] = useState({});

    const [emailCode, setEmailCode] = useState(Array(6).fill(''));
    const [smartphoneCode, setSmartphoneCode] = useState(Array(6).fill(''));

    const [emailSendCodeButtonState, setEmailSendCodeButtonState] = useState('enabled');
    const [confirmPasswordButtonState, setConfirmPasswordButtonState] = useState('enabled');
    const [confirmSmartphoneMfaButtonState, setConfirmSmarphoneMfaButtonState] = useState('enabled');
    const [validateCodeButtonState, setValidateCodeButtonState] = useState('enabled');
    const [signupButtonState, setSignupButtonState] = useState('enabled');


    useEffect(() => {
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
    }, []);


    useEffect(() => {
        if (location.pathname === `/${pageId}`) {
            document.title = `${t('sign.up.v')} - Minhas Finanças`;

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
            //}

            // Esconde o elemento que apresenta o QR Code de MFA, pois o campo de email precisa estar preenchido corretamente para que ele apareça
            $('#mobile-imgs img').hide();
        }

    }, [location.pathname]);


    useEffect(() => {
        document.body.classList.remove('bright', 'dark');
        document.body.classList.add(appTheme);
        i18n.changeLanguage(appLang);
    }, [appTheme, appLang]);


    useEffect(() => { // on username change
        let emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setIsEmailValid(username.match(emailRegex));
    }, [username]);


    useEffect(() => {
        $userCard.show();

        setMfaQRCode(null);
        setConfirmSmarphoneMfaButtonState('disabled');
        setEmailSendCodeButtonState('disabled');
        setConfirmPasswordButtonState('disabled');
        setConfirmSmarphoneMfaButtonState('disabled');
        setValidateCodeButtonState('disabled');
        setSignupButtonState('disabled');

        setEmailCode(Array(6).fill(''));
        setSmartphoneCode(Array(6).fill(''));

        if (currentStep == 0) {
            setEmailSendCodeButtonState('enabled');

            if (currentSubstep == 0)
                $userCard.hide();

            else if (currentSubstep == 1) {
                setValidateCodeButtonState('enabled');
            }
        }

        else if (currentStep == 1 && currentSubstep == 0) {
            setValidateCodeButtonState('enabled');
        }

        else if (currentStep == 2 && currentSubstep == 0) {
            setConfirmSmarphoneMfaButtonState('enabled');

            const qrCodeEndpoint = qrCodesOpenGetEndpoint(username);
            setMfaQRCode(qrCodeEndpoint);
        }

        $('.steps-flow-step').hide();
        $(`#step-${currentStep}-${currentSubstep}`).show();

        let lastSubstepsPerStepAux = lastSubstepsPerStep;

        if (!(currentStep in lastSubstepsPerStepAux) || currentSubstep != lastSubstepsPerStepAux[currentStep]) {
            lastSubstepsPerStepAux[currentStep] = currentSubstep;
            setlastSubstepsPerStep(lastSubstepsPerStepAux);
        }

    }, [currentStep, currentSubstep]);


    useEffect(() => {

        const isUserElegible = isEmailValid && isEmailMfaValid && isPasswordValid && isSmartphoneMfaValid && isTermsOfServiceAccepted && isPrivacyPolicyAccepted;
        setSignupButtonState(isUserElegible ? 'enabled' : 'disabled');
        if (isUserElegible) $('#step-4-0').show();

        return () => setSignupButtonState('disabled');
    }, [isEmailValid, isEmailMfaValid, isPasswordValid, isSmartphoneMfaValid, isTermsOfServiceAccepted, isPrivacyPolicyAccepted]);


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
        setConfirmPasswordButtonState(isPasswordValid ? 'enabled' : 'disabled');
    }, [isPasswordValid]);


    const resetSignUp = () => {
        // Browser dialog
        let result = confirm(t('confirm-reset-sign-up'));

        if (!result) { return; }

        // Limpar o estado do QR code ao reiniciar o processo
        setMfaQRCode(null);

        setCurrentStep(0);
        setCurrentSubstep(0);

        $fullname.prop('disabled', false);
        $username.prop('disabled', false);
        $password.prop('disabled', false);
        $confirmPassword.prop('disabled', false);

        $('#step-4-0').hide();

        setPassword('');
        setConfirmPassword('');
    };

    const handleFullnameChange = (event) => {
        setFullname(event.target.value);
        $fullname.removeClass('required');
    };


    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        $username.removeClass('required');
    };


    const handleTelChange = (event) => {
        setTel(event.target.value);
        $tel.removeClass('required');
    };


    const handleSubmit = async () => {

        setSignupButtonState('loading');

        if (fullname === '') {
            setSignupButtonState('error');
            $fullname.addClass('required');
        }
        else $fullname.removeClass('required');

        if (username === '') {
            setSignupButtonState('error');
            $username.addClass('required');
        }
        else $username.removeClass('required');

        if (password === '') {
            setSignupButtonState('error');
            $password.addClass('required');
        }
        else $password.removeClass('required');

        const result = await usersMePost({
            fullname,
            username,
            password
        });

        let { isSuccess, status, errorType } = result;

        if (isSuccess) {
            setSignupButtonState('success');
            setPopUpLevel('success');
            setPopUpText(t('api_codes.sign-up.201_0'));
            setPopUpDuration(1500);

            setTimeout(() => navigate('/overview'), 2500);
        }
        else {
            setSignupButtonState('error');
            switch (errorType) {
                case 'AlreadyExistsError':
                    setPopUpText(t(`api_codes.sign-up.${status}_1`));
                    break;
                default:
                    setPopUpText(t(`api_codes.default.${status}_0`));
                    break;
            }
            setPopUpLevel('warning');
        }
    };


    const goToSignin = () => {
        setTimeout(() => navigate('/sign-in'));
    };


    const sendCodeToEmail = async () => {

        if (isEmailValid && currentStep === 0) {
            setEmailSendCodeButtonState('loading');
            setPopUpText(t('send-code-email'));
            setPopUpLevel('info');

            const tempTokenResult = await sessionsTempGet({
                email: username
            });

            if (tempTokenResult.isSuccess) {

                var { access_token, token_type } = tempTokenResult.response;

                setTempToken(token_type + ' ' + access_token);

                const sendEmailresult = await emailsPost({
                    email: username,
                    language: appLang
                });

                if (sendEmailresult.isSuccess) {
                    setEmailSendCodeButtonState('enabled');
                    setPopUpText(t('sent-code-email'));
                    setPopUpLevel('success');
                    setCurrentSubstep(1);
                    return;
                }
            }

            setEmailSendCodeButtonState('error');
            setPopUpText(t('send-code-email-fail'));
            setPopUpLevel('error');
        }
        else {
            setPopUpText(t('invalid-email-try-again'));
            setPopUpLevel('warning');
        }
    };


    const goBackToStep = (step) => {

        let lastSubstep = lastSubstepsPerStep[step];

        $('.steps-flow-step').hide();
        $(`#step-${step}-${lastSubstep}`).show();
    };


    const validateEmailMfa = async (id) => {

        var oauthmfa = $(id).val();

        if (oauthmfa.length != 6) {
            setPopUpText(t('mfa-6-digits'));
            setPopUpLevel('warning');
            return;
        }

        const result = await sessionsMeTempMfaGet({
            oauthmfa,
            mfa_type: 'HOTP',
            tempToken
        });

        if (result.isSuccess) {

            setPopUpLevel('success');
            setPopUpText(t('valid-email-mfa'));

            $fullname.prop('disabled', true);
            $username.prop('disabled', true);

            var [, , step, ,] = id.split('-');

            setIsEmailMfaValid(true);
            setCurrentStep((+step) + 1);
            setCurrentSubstep(0);
        }
    };


    const validateSmartphoneMfa = async (id) => {
        var oauthmfa = $(id).val();

        if (oauthmfa.length != 6) {
            setConfirmSmarphoneMfaButtonState('error');
            setPopUpText(t('mfa-6-digits'));
            setPopUpLevel('warning');
            return;
        }

        setConfirmSmarphoneMfaButtonState('loading');

        const result = await sessionsMeTempMfaGet({
            oauthmfa,
            mfa_type: 'TOTP',
            tempToken
        });

        if (result.isSuccess) {

            setConfirmSmarphoneMfaButtonState('success');

            setPopUpLevel('success');
            setPopUpText(t('valid-smartphone-mfa'));

            $fullname.prop('disabled', true);
            $username.prop('disabled', true);

            var [, , step, ,] = id.split('-');

            setIsSmartphoneMfaValid(true);
            setCurrentStep((+step) + 1);
            setCurrentSubstep(0);
        }
        else {
            setConfirmSmarphoneMfaButtonState('error');

            setPopUpLevel('error');
            setPopUpText(t('invalid-code'));
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        $password.removeClass('required');
    };


    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        $confirmPassword.removeClass('required');
    };


    useEffect(() => {
        const quickSettings = document.querySelector('.quick-settings');
        const signInPanel = document.querySelector('#sign-up-parent');
        
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
        <Page id='sign-up-page-base' backgroundImage={BgAuthentication}> {/** className={isLeaving ? 'leaving' : ''} */}

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
                    <div id='sign-up-parent'>
                        <Panel
                            className='browser'
                            g='2'
                            id='sign-up-panel'
                            p='ter'
                        >
                            <Row a='center' g='0'>
                                <p>{t('already-sign-uped')}&nbsp;</p>

                                <Link
                                    onClick={() => {
                                        let result = confirm(t('confirm-reset-sign-up'));
                                        if (result) goToSignin();
                                    }}
                                >
                                    <p>{t('sign.in.v')}</p>
                                </Link>
                            </Row>

                            <Row fill='width' j='center'>
                                <Title variation='secondary' txt={t('sign.up.v')} />
                            </Row>

                            <Column fill='width'>
                                <div id='sign-up-form'>
                                    <Column
                                        fill='width'
                                        g='1'
                                    >

                                        <StepsFlow currentStep={currentStep} steps={steps} onClick={goBackToStep} />

                                        <div id='user-card-div' hidden>
                                            <UserCard
                                                fullname={fullname}
                                                onClick={() => resetSignUp()}
                                                username={username} />
                                        </div>

                                        <Column fill='width' id='step-content'>

                                            {/* STEP 0.0 */}
                                            <form
                                                className='steps-flow-step g-1'
                                                name='send-email-code'
                                                id='step-0-0'
                                            >
                                                <Input
                                                    id='sign-up-fullname-input'
                                                    onChange={handleFullnameChange}
                                                    placeholder={t('name')}
                                                    variation='text'
                                                    value={fullname}
                                                />

                                                <Input
                                                    id='sign-up-username-input'
                                                    onChange={handleUsernameChange}
                                                    placeholder={t('username.s')}
                                                    variation='email'
                                                    value={username}
                                                />

                                                <p>{t('enter-name-and-email')}</p>

                                                <Row fill='width' j='end'>
                                                    <Button
                                                        name='send-email-code'
                                                        id='step-0-0-btn-send'
                                                        state={emailSendCodeButtonState}
                                                        type='submit'
                                                        onClick={() => sendCodeToEmail()}
                                                    >{t('send-code')}</Button>
                                                </Row>
                                            </form>

                                            {/* STEP 0.1 */}
                                            <form
                                                className='steps-flow-step g-1'
                                                name='validate-email'
                                                hidden
                                                id='step-0-1'
                                            >

                                                <p>{t('validate-email-code')}</p>

                                                <Input
                                                    code={emailCode}
                                                    id='oauth-input-0-1'
                                                    setCode={setEmailCode}
                                                    variation='mfa-code'
                                                />

                                                <Row fill='width' j='between'>
                                                    <Button
                                                        id='step-0-0-btn-resend'
                                                        className='secondary'
                                                        onClick={() => sendCodeToEmail()}
                                                        state={emailSendCodeButtonState}
                                                    >{t('resend-code')}</Button>

                                                    <Button
                                                        id='step-0-1-btn-validate'
                                                        className='primary'
                                                        disabled={!(currentStep == 0 && currentSubstep == 1)}
                                                        name='validate-email'
                                                        onClick={() => validateEmailMfa('#oauth-input-0-1-result')}
                                                        state={validateCodeButtonState}
                                                    >{t('validate-code')}</Button>
                                                </Row>
                                            </form>

                                            {/* STEP 1.0 */}
                                            <form
                                                className='steps-flow-step g-1'
                                                name='insert-password'
                                                hidden
                                                id='step-1-0'
                                            >
                                                <p>{t('insert-password')}</p>

                                                <Input
                                                    id='sign-up-password-input'
                                                    onChange={handlePasswordChange}
                                                    placeholder={t('password.s')}
                                                    variation='password'
                                                    value={password}
                                                />

                                                <Input
                                                    id='sign-up-confirm-password-input'
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
                                                        onClick={() => setCurrentStep(2)}
                                                        state={confirmPasswordButtonState}
                                                    >{t('next')}</Button>
                                                </Row>
                                            </form>

                                            {/* STEP 2.0 */}
                                            <form
                                                className='steps-flow-step g-1'
                                                name='validate-smartphone-mfa'
                                                hidden
                                                id='step-2-0'
                                            >
                                                <Row a={'start'} fill={'width'}>
                                                    <p id='mfa-message'>{t('qr-code')}</p>

                                                    {mfaQRCode
                                                        ? <img id='mfa-code-img' src={mfaQRCode} alt='Multi-Factor Authentication QR Code' />
                                                        : <div id='mfa-code-img-loading'>
                                                            <img className='spinning' src={LoadingImg} />
                                                        </div>
                                                    }
                                                </Row>

                                                <p>{t('validate-auth-smartphone-code').replace('{username}', username)}</p>

                                                <Input
                                                    code={smartphoneCode}
                                                    id='oauth-input-2-0'
                                                    setCode={setSmartphoneCode}
                                                    variation='mfa-code'
                                                />

                                                <Row fill='width' j='end'>
                                                    <Button
                                                        id='step-2-0-btn-validate'
                                                        className='primary'
                                                        name='validate-smartphone-mfa'
                                                        onClick={() => validateSmartphoneMfa('#oauth-input-2-0-result')}
                                                        state={confirmSmartphoneMfaButtonState}
                                                    >{t('validate-code')}</Button>
                                                </Row>
                                            </form>

                                            {/* STEP 2.1 */}
                                            <form
                                                className='steps-flow-step g-1'
                                                name='validate-imessage-mfa'
                                                hidden
                                                id='step-2-1'
                                            >
                                                <p>{t('insert-imessages-tel')}</p>

                                                <Input
                                                    id='tel-input-2-1'
                                                    onChange={handleTelChange}
                                                    placeholder={t('Phone number')}
                                                    variation='tel'
                                                    value={tel}
                                                />

                                                <p>{t('validate-smartphone-code')}</p>

                                                <Input
                                                    code={smartphoneCode}
                                                    id='oauth-input-2-1'
                                                    setCode={setSmartphoneCode}
                                                    variation='mfa-code'
                                                />

                                                <Row fill='width' j='end'>
                                                    <Button
                                                        id='step-2-1-btn-validate'
                                                        className='primary'
                                                        disabled={!(currentStep == 2 && currentSubstep == 0)}
                                                        name='validate-imessage-mfa'
                                                        onClick={() => validateSmartphoneMfa('#oauth-input-2-1-result')}
                                                    >{t('validate-code')}</Button>
                                                </Row>
                                            </form>

                                            {/* STEP 2.2 */}
                                            <form
                                                className='steps-flow-step g-1'
                                                name='validate-telegram-mfa'
                                                hidden
                                                id='step-2-2'
                                            >
                                                <p>{t('insert-telegram-tel')}</p>

                                                <Input
                                                    id='tel-input-2-2'
                                                    onChange={handleTelChange}
                                                    placeholder={t('Phone number')}
                                                    variation='tel'
                                                    value={tel}
                                                />

                                                <p>{t('validate-smartphone-code')}</p>

                                                <Input
                                                    code={smartphoneCode}
                                                    id='oauth-input-2-2'
                                                    setCode={setSmartphoneCode}
                                                    variation='mfa-code'
                                                />

                                                <Row fill='width' j='end'>
                                                    <Button
                                                        id='step-2-2-btn-validate'
                                                        className='primary'
                                                        disabled={!(currentStep == 2 && currentSubstep == 0)}
                                                        name='validate-telegram-mfa'
                                                        onClick={() => validateSmartphoneMfa('#oauth-input-2-2-result')}
                                                    >{t('validate-code')}</Button>
                                                </Row>
                                            </form>

                                            {/* STEP 2.3 */}
                                            <form
                                                className='steps-flow-step'
                                                name='validate-whatsapp-mfa'
                                                hidden
                                                id='step-2-3'
                                            >
                                                <p>{t('insert-whatsapp-tel')}</p>

                                                <Input
                                                    id='tel-input-2-3'
                                                    onChange={handleTelChange}
                                                    placeholder={t('Phone number')}
                                                    variation='tel'
                                                    value={tel}
                                                />

                                                <p>{t('validate-smartphone-code')}</p>

                                                <Input
                                                    code={smartphoneCode}
                                                    id='oauth-input-2-3'
                                                    setCode={setSmartphoneCode}
                                                    variation='mfa-code'
                                                />

                                                <Row fill='width' j='end'>
                                                    <Button
                                                        id='step-2-3-btn-validate'
                                                        className='primary'
                                                        disabled={!(currentStep == 2 && currentSubstep == 0)}
                                                        name='validate-whatsapp-mfa'
                                                        onClick={() => validateSmartphoneMfa('#oauth-input-2-3-result')}
                                                    >{t('validate-code')}</Button>
                                                </Row>
                                            </form>

                                            {/* STEP 3.0 */}
                                            <Column className='steps-flow-step' id='step-3-0' hidden>
                                                <p>{t('open-and-read-docs')}</p>

                                                <ReadDoc
                                                    label={t('terms-of-service.p')}
                                                    href={termsOfServiceDoc}
                                                    isRead={isTermsOfServiceAccepted}
                                                    onOpenDoc={() => { setIsTermsOfServiceAccepted(true); }}
                                                />

                                                <ReadDoc
                                                    label={t('privacy-policy')}
                                                    href={privacyPolicyDoc}
                                                    isRead={isPrivacyPolicyAccepted}
                                                    onOpenDoc={() => { setIsPrivacyPolicyAccepted(true); }}
                                                />
                                            </Column>

                                            {/* STEP 4.0 */}
                                            {isTermsOfServiceAccepted && isPrivacyPolicyAccepted
                                                ? <Column id='step-4-0' hidden>
                                                    <p>{t('done-sign-up')}</p>

                                                    <Button
                                                        className='primary fill-all'
                                                        id='sign-up-button'
                                                        onClick={() => handleSubmit()}
                                                        state={signupButtonState}
                                                        type='submit'
                                                    >{t('sign.up.i')}</Button>
                                                </Column>
                                                : null
                                            }
                                        </Column>
                                    </Column>
                                </div>
                            </Column>
                        </Panel>
                    </div>
                </Column>
            </Layout>
        </Page>
    );
};

export default SignUp;
