/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import i18n from 'locales/i18n';
import $ from 'jquery';

import Gravatar from 'react-gravatar';

import { useTranslation } from 'react-i18next';

import {
    Loading, Link,
    MessagePopup, SwitchableIcon
} from 'components/imports';
import { ConfirmSvg, LoadingSvg, PencilSvg, UserDefaultPic128Png } from 'icons/imports';
import {
    qrCodesMeGet,
    usersMeGet, usersMePatch
} from 'apis/imports';

import { Button, Column, Layout, Page, Row } from 'components/imports';
import { Input, Panel, Title } from 'components/imports';

import { getLanguage, getTheme } from 'utils/cookies';
import { abbreviateText } from 'utils/general';

import './Settings.css';


const Settings = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const pageId = 'settings';

    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);

    const [appLang,] = useState(getLanguage());
    const [appTheme,] = useState(getTheme());

    const [fullname, setFullname] = useState('-');
    const [username, setUsername] = useState('-');

    const [showQrCode, setShowQrCode] = useState(false);
    const [mfaQRCode, setMfaQRCode] = useState();

    const [editFullname, setEditFullname] = useState(false);
    const [newFullname, setNewFullname] = useState('-');

    const [changePassword, setChangePassword] = useState(false);
    const [someChange, setSomeChange] = useState(false);

    const [popUpLevel, setPopUpLevel] = useState('warning');
    const [popUpText, setPopUpText] = useState('-');
    const [popUpDuration, setPopUpDuration] = useState(3500);

    const $fullname = $('#user-fullname-input');

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isPatchingUser, setIsPatchingUser] = useState(false);
    const [showMfaQrCodeButtonState, setShowMfaQrCodeButtonState] = useState('enabled');


    useEffect(() => {
        if (location.pathname === `/${pageId}`) {
            document.title = `${t('settings')} - Minhas Finanças`;

            $('#user-fullname-input').hide();
            $('#user-fullname-label').hide();
            $('#mfa-code-message').hide();
            $('#mfa-code-img').hide();
            $('.message-popup-container').fadeOut();

            fetchApi();
        }
    }, [location.pathname]);

    useEffect(() => {
        document.body.classList.remove('bright', 'dark');
        document.body.classList.add(appTheme);
        i18n.changeLanguage(appLang);
    }, [appTheme, appLang]);


    useEffect(() => {
        $('.settings-container .email-text').prop('title', username);
        $('.settings-container .email-text').text(
            username.length > 25 ? abbreviateText(username, 22).replace('...', '') + '...' : username);
    }, [username]);


    useEffect(() => {
        $('.settings-container .fullname-text').prop('title', fullname);
        $('.settings-container .fullname-text').text(
            fullname.length > 25 ? abbreviateText(fullname, 22).replace('...', '') + '...' : fullname);
    }, [fullname]);


    useEffect(() => {
        if (fullname !== newFullname) {
            setSomeChange(true);
            setFullname(newFullname.trim());
        }
    }, [editFullname]);


    useEffect(() => {
    }, [changePassword]);


    useEffect(() => {
        // Send Patch request if user closed edit mode
        if (!editFullname && someChange) patchUser();
    }, [editFullname, someChange]);


    const getUserIdentity = () => {
        return {
            'id': 'c6b5e896-8728-49a1-add2-944b6787bd58',
            'itemId': '23a7d313-881f-4e7b-939f-bea8ed7b8b0d',
            'createdAt': '2024-12-04T22:18:40.359Z',
            'updatedAt': '2024-12-04T22:18:40.359Z',
            'birthDate': '1991-05-01T00:00:00.000Z',
            'taxNumber': '38.512.121/0001-95',
            'document': '076.630.975-48',
            'documentType': 'CPF',
            'jobTitle': 'Comercial',
            'companyName': 'Pluggy LTDA',
            'fullName': 'Francisco Sousa',
            'phoneNumbers': [
                {
                    'value': '+55 19 12345678',
                    'type': 'Personal'
                }
            ],
            'emails': [
                {
                    'value': 'myemail@pluggy.ai',
                    'type': 'Personal'
                }
            ],
            'addresses': [
                {
                    'fullAddress': 'Av. Lúcio Costa 1234, Copacabana, Rio de Janeiro, Brasil',
                    'state': 'RJ',
                    'primaryAddress': 'Av. Lúcio Costa, 1234',
                    'country': 'Brasil',
                    'type': 'Personal',
                    'postalCode': '22620-171',
                    'city': 'Rio de Janeiro'
                }
            ],
            'relations': [
                {
                    'name': 'Juan Do Lopez',
                    'type': 'Father',
                    'document': null
                },
                {
                    'name': 'Laura De Oliva',
                    'type': 'Spouse',
                    'document': null
                }
            ],
            'investorProfile': 'Moderate',
            'establishmentCode': null,
            'establishmentName': null,
            'financialRelationships': null,
            'qualifications': null
        };
    };

    const fetchApi = async () => {

        if (!isUserAuthenticated) return;

        await fetchUserData();

        setIsLoadingPage(false);
    };


    const fetchMfaQrCode = async () => {

        setShowMfaQrCodeButtonState('loading');

        const result = await qrCodesMeGet();

        if (result.isSuccess) {
            setShowMfaQrCodeButtonState('success');
            const imageBlob = result.response;
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setMfaQRCode(imageObjectURL);
            setShowQrCode(true);

            return;
        }

        setShowMfaQrCodeButtonState('error');

        setPopUpLevel('error');
        setPopUpText(t('error-fetch-mfa-qr-code'));
        setPopUpDuration(3500);
    };


    const patchUser = async () => {

        setSomeChange(false);
        setIsPatchingUser(true);

        const result = await usersMePatch({ body: { fullname } });

        setIsPatchingUser(false);

        if (result.isSuccess) {
            setPopUpLevel('success');
            setPopUpText(t('success-fullname-change'));
            setPopUpDuration(2000);

            setTimeout(() => {
                window.location.reload();
            }, 2000);
            return;
        }

        setPopUpLevel('error');
        setPopUpText(t('error-fullname-change'));
        setPopUpDuration(3500);
    };


    const fetchUserData = async () => {
        const result = await usersMeGet();
        if (result.isSuccess) {
            setFullname(result.response.fullname);
            setNewFullname(result.response.fullname);
            setUsername(result.response.username);
        }
    };

    const handleFullnameChange = (event) => {
        setNewFullname(event.target.value);
        $fullname.removeClass('required');
    };


    const handleToggleEditFullName = () => {
        setEditFullname(!editFullname);
    };


    const pencilSvg = <PencilSvg className='icon-svg' title={t('edit.s')} />;
    const confirmSvg = <ConfirmSvg className='icon-svg' title={t('confirm')} />;


    return (
        <Page id={pageId} >
            <MessagePopup
                duration={popUpDuration}
                level={popUpLevel}
                text={popUpText}
            />

            <Layout
                checkAuth={true}
                page={pageId}
                quickSettings='basic'
                setIsUserAuthenticated={setIsUserAuthenticated}
                showHeader={true}
                showToolbar={true}
                dialogConfirm={false}
                maximizedScreen={false}
            >
                {isLoadingPage
                    ? <Loading id={'settings-overlay'} />
                    : (
                        <Column
                            a='center'
                            fill='all'
                        >
                            <Row
                                a='start'
                                fill='height'
                                fit='width'
                            >
                                <Column fit='all'>
                                    <Panel id='profile-pic'
                                        fill='height'
                                        fit='height'
                                    >
                                        <Title
                                            txt={t('profile-pic')}
                                            variation='secondary'
                                        />

                                        <hr />

                                        <Gravatar
                                            email={'leonardocech.dev@gmail.com'}
                                            id='session-pic'
                                            size={240}
                                            rating='pg'
                                        />

                                        <p>A foto de perfil é obtida utilizando o</p>

                                        <Link href='https://gravatar.com' target='_blank' rel='noreferrer'><p>Gravatar</p></Link>
                                    </Panel>

                                    <Panel id='personal-data'
                                        fill='height'
                                        fit='height'
                                    >
                                        <Title variation='secondary' txt={t('personal-data')} />

                                        <hr />

                                        <Column id={pageId + '-col-0-0'} fill='all'>
                                            <Column fill='width' j='between'>
                                                <p className='label'><b>{t('fullname')}</b></p>
                                                <Row fill='width' j='between'>
                                                    {editFullname
                                                        ? <Input
                                                            id={'user-fullname-input'}
                                                            onChange={handleFullnameChange}
                                                            placeholder={t('fullname')}
                                                            value={newFullname}
                                                            variation='text-minimal'
                                                        />
                                                        : <p id='user-fullname-label' className='fullname-text' title='-'>{fullname}</p>
                                                    }
                                                    {isPatchingUser
                                                        ? <LoadingSvg className='icon-svg spinning' style={{ padding: '.5rem' }} />
                                                        : <SwitchableIcon id='edit-fullname-button'
                                                            offImage={pencilSvg}
                                                            onImage={confirmSvg}
                                                            isOn={editFullname}
                                                            onToggle={handleToggleEditFullName}
                                                        />}
                                                </Row>
                                            </Column>

                                            <Column fill='width'>
                                                <p className='label'><b>{t('username.s')}</b></p>
                                                <p className='email-text' title={username}>{username}</p>
                                            </Column>
                                        </Column>
                                    </Panel>
                                </Column>

                                <Column style={{ width: '16.5rem' }}>
                                    <Panel id='mfa'
                                        fit='height'
                                    >
                                        <Title variation='secondary' txt={t('account-security')} />

                                        <hr />

                                        {showQrCode
                                            ? <Column>
                                                <img
                                                    alt='Multi-Factor Authentication QR Code'
                                                    className='mfa-qr-code'
                                                    src={mfaQRCode}
                                                />

                                                <p>{t('mfaqrcode-label')}</p>

                                                <Button id='add-exchange-button'
                                                    onClick={() => setShowQrCode(false)}
                                                    variation='secondary'
                                                >{t('hide-mfa-qr-code')}</Button>
                                            </Column>
                                            : <Button id='add-exchange-button'
                                                onClick={() => fetchMfaQrCode()}
                                                state={showMfaQrCodeButtonState}
                                                variation='secondary'
                                            >{t('reveal-mfa-qr-code')}</Button>
                                        }

                                        <hr />

                                        <Button id='add-exchange-button'
                                            onClick={() => {
                                                const result = confirm(t('ask-confirm-reset-password-redirect'));
                                                if (result)
                                                    navigate('/reset-password');
                                            }}
                                        >{t('password.change')}</Button>

                                    </Panel>
                                </Column>
                            </Row>
                        </Column>
                    )}
            </Layout>
        </Page >
    );
};

export default Settings;
