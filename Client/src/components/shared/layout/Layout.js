
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import $ from 'jquery';
import PropTypes from 'prop-types';

import packageJson from '../../../../package.json';

import { useTranslation } from 'react-i18next';
import i18n from 'locales/i18n';

import { Segmented } from 'antd';

import {
    Column, Header, MessagePopup, Row, SwitchableIcon,
    Title, Toolbar, MfaModal
} from 'components/imports';

import { BnxIconLogoSvg, SunSvg, MoonSvg } from 'icons/imports';
import { MinhasFinancasExtLogoSvg } from 'images/imports';

import {
    getLanguage as getCookieLanguage, setLanguage as setCookieLanguage,
    getTheme as getCookieTheme, setTheme as setCookieTheme
} from 'utils/cookies';

import { pageLoaded } from 'utils/pages';
import { checkAuthorization } from 'utils/token';

import { sessionsMeMfaGet } from 'apis/imports';

import './Layout.css';


const Layout = (props) => {

    // Get version from package.json
    const version = packageJson.version;

    const checkAuth = props.checkAuth;
    const pageId = props.page;
    const showHeader = props.showHeader || false;
    const showSegmented = props.showSegmented || false;
    const showToolbar = props.showToolbar || false;
    const showTopLogo = props.showTopLogo || false;
    const showVersion = props.showVersion || false;
    const segmentedOptions = props.segmentedOptions || [];
    const segmentedValue = props.segmentedValue || '';
    const segmentedOnChange = props.segmentedOnChange || (() => { });

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    const [language, setLanguage] = useState(getCookieLanguage());
    const [theme, setTheme] = useState(getCookieTheme());

    const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [mfaModalVerifyButtonState, setMfaModalVerifyButtonState] = useState('enabled');

    const popUp = props.popUp || { level: 'success', text: '', duration: 0 };

    const moonIcon = <MoonSvg className='icon-svg' />;
    const sunIcon = <SunSvg className='icon-svg' />;

    useEffect(() => {
        $(document).scrollTop = 0;
        $('html, body').animate({ scrollTop: 0 }, 1);

        let $body = document.body.classList;
        $body.remove(...$body);
        $body.add(pageId + '-page');

        localStorage.setItem('lastVisitedPage', location.pathname);

        changeLanguage();
        changeTheme();

        if (checkAuth) {
            checkAuthorization(navigate, setIsMfaModalOpen, setUsername, setIsUserAuthenticated);
        }

        pageLoaded(pageId);
    }, [location.pathname]);


    useEffect(() => {
        if (isUserAuthenticated) {

            if (props.setIsUserAuthenticated)
                props.setIsUserAuthenticated(isUserAuthenticated);
        }
    }, [isUserAuthenticated]);


    const changeLanguage = (newLang = language) => {
        setLanguage(newLang);
        setCookieLanguage(newLang);
        // setCurrentStep(3);
        i18n.changeLanguage(newLang);
    };


    const changeTheme = (newTheme = theme) => {
        setTheme(newTheme);
        setCookieTheme(newTheme);

        document.body.classList.remove('bright', 'dark');
        document.body.classList.add(newTheme);
    };

    const handleMfaModalSubmit = async (oauthmfa) => {

        setMfaModalVerifyButtonState('loading');

        var mfa_type = 'TOTP';

        if (oauthmfa === '') {
            setMfaModalVerifyButtonState('error');
            return;
        }

        // Validations to avoid unecessary API calls
        if (oauthmfa.length !== 6) {
            setMfaModalVerifyButtonState('error');
            return;
        }

        setMfaModalVerifyButtonState('loading');

        let result = await sessionsMeMfaGet({
            oauthmfa,
            mfa_type
        });

        $('form #check-code-button').css('cursor', 'pointer');
        if (result.isSuccess) {
            setMfaModalVerifyButtonState('success');
            window.location.reload();
        } else {
            setMfaModalVerifyButtonState('error');
        }
    };


    return (
        <div className={props.page + ' layout browser'} style={{ 'display': 'none' }}>

            <MessagePopup level={popUp.level} text={popUp.text} duration={popUp.duration} />

            <MfaModal
                isOpen={isMfaModalOpen}
                handleSubmit={handleMfaModalSubmit}
                setIsOpen={setIsMfaModalOpen}
                username={username}
                verifyButtonState={mfaModalVerifyButtonState}
            />

            <div className='all-page-content'>

                {showToolbar ? <Toolbar page={props.page} /> : <></>}

                <Column fill='all' m='pri-ver'>
                    {showHeader
                        ? <Header variation='primary'>
                            <Row
                                className='header-section'
                            >
                                <Title variation='primary' txt={t(pageId)} id={`step-${pageId}-title`} />

                                {showSegmented
                                    ? <Segmented
                                        options={segmentedOptions}
                                        value={segmentedValue}
                                        onChange={segmentedOnChange}
                                    />
                                    : <></>
                                }
                            </Row>

                            <Row
                                className='header-section'
                                j='end'
                            >
                                <SwitchableIcon id="theme-switch-step"
                                    onImage={sunIcon}
                                    isOn={theme === 'dark'}
                                    offImage={moonIcon}
                                    onToggle={() => changeTheme(theme === 'dark' ? 'bright' : 'dark')}
                                />
                            </Row>
                        </Header>
                        : (showTopLogo
                            ? <Row
                                fill='width'
                                j='between'
                            >
                                <img id='minhas-financas-logo' src={MinhasFinancasExtLogoSvg} />

                                <Row
                                    className='quick-settings'
                                    j='end'
                                >

                                    <SwitchableIcon id="theme-switch-step"
                                        onImage={sunIcon}
                                        isOn={theme === 'dark'}
                                        offImage={moonIcon}
                                        onToggle={() => changeTheme(theme === 'dark' ? 'bright' : 'dark')}
                                    />
                                </Row>
                            </Row>
                            : <Row
                                className='quick-settings basic'
                                fill='width'
                                j='between'
                                m='pri-hor'
                            >
                                <Row id='logo'>
                                    <img id='minhas-financas-logo-header' src={BnxIconLogoSvg} />

                                    <img id='minhas-financas-logo-header' src={MinhasFinancasExtLogoSvg} />
                                </Row>

                                <Row>
                                    <SwitchableIcon id="theme-switch-step"
                                        onImage={sunIcon}
                                        isOn={theme === 'dark'}
                                        offImage={moonIcon}
                                        onToggle={() => changeTheme(theme === 'dark' ? 'bright' : 'dark')}
                                    />
                                </Row>
                            </Row>)}

                    {props.children}
                </Column>
            </div>

            {showVersion ? <p className='version'>v{version}</p> : <></>}
        </div>
    );
};


Layout.propTypes = {
    checkAuth: PropTypes.bool.isRequired,
    children: PropTypes.node,
    popUp: PropTypes.object,
    page: PropTypes.string.isRequired,
    segmentedOnChange: PropTypes.func,
    segmentedOptions: PropTypes.array,
    segmentedValue: PropTypes.string,
    setIsUserAuthenticated: PropTypes.func,
    showHeader: PropTypes.bool,
    showSegmented: PropTypes.bool,
    showToolbar: PropTypes.bool,
    showTopLogo: PropTypes.bool,
    showVersion: PropTypes.bool,
};


export default Layout;
