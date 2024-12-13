
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { useTranslation } from 'react-i18next';
// import i18n from 'locales/i18n';

import { Dropdown } from 'antd';

import Gravatar from 'react-gravatar';

import {
    ConfirmSignOut,
    PageLink,
    SwitchableIcon
} from 'components/imports';

import {
    MinhasFinancasIconLogo128Png, DocumentSvg, LockSvg, OverviewSvg, SettingsSvg, SignOutSvg,
    UnlockSvg
} from 'icons/imports';

import { getUserFromCookie } from 'utils/cookies';


import { MinhasFinancasExtLogoSvg } from 'images/imports';

import { sessionsMeDelete, usersMeGet } from 'apis/imports';

import { Button, Column, Row } from 'components/imports';

import './Toolbar.css';

import { termsOfServiceDoc, privacyPolicyDoc, cookiesPolicyDoc, insightSourcesLinks } from 'constants';


const Toolbar = (props) => {

    const page = props.page;

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const [showActions, setShowActions] = useState(false);
    const [showAtsPages, setShowAtsPages] = useState(false);
    const [selectedDropdown, setSelectedDropdown] = useState('');

    const [signOutModalEnabled, setSignOutModalEnabled] = useState(false);
    const [user, setUser] = useState(getUserFromCookie());

    // var dashboardSvg = <DashboardSvg className='icon-svg'></DashboardSvg>;
    var documentSvg = <DocumentSvg className='icon-svg'></DocumentSvg>;
    var overviewSvg = <OverviewSvg className='icon-svg'></OverviewSvg>;
    var settingsSvg = <SettingsSvg className='icon-svg'></SettingsSvg>;
    var signOutSvg = <SignOutSvg id='sign-out' className='icon-svg'></SignOutSvg>;

    const [isHoverActive, setIsHoverActive] = useState(false);
    const [isToolbarLocked, setIsToolbarLocked] = useState(localStorage.getItem('isToolbarLocked') === 'true' ? true : false);
    const timerRef = useRef(null);

    const lockIcon = <LockSvg className='icon-svg'></LockSvg>;
    const unlockIcon = <UnlockSvg className='icon-svg'></UnlockSvg>;

    useEffect(() => {
        setShowActions(false);
        setShowAtsPages(false);
        getUser();
    }, [location.pathname]);


    $(document).on('click', (e) => {

        var foundId = false;

        const idSearchOnHierarchy = (e, id) => {

            var node = e;

            if ('target' in e) {
                foundId = false;
                node = e.target;
            }

            if (foundId) return;
            else {
                if (node && 'id' in node && node.id.includes(id)) {
                    foundId = true;
                    return;
                }
                else {
                    if (!node.parentNode) {
                        foundId = false;
                        return;
                    }
                    else {
                        idSearchOnHierarchy(node.parentNode, id);
                    }
                }
            }
        };

        (idSearchOnHierarchy(e, 'actions-dd'));
        if (foundId) return;

        try {
            setShowActions(false);
            setShowAtsPages(false);

            if (selectedDropdown !== '') {
                switch (selectedDropdown) {
                    case 'actions-dd':
                        setShowActions(!showActions);
                        break;
                    case 'ats-pages-dd':
                        setShowAtsPages(!showAtsPages);
                        break;
                    default:
                        console.error('There is no expected case for selectedDropdown as ' + selectedDropdown);
                        break;
                }
                setSelectedDropdown('');
            }
        }
        catch (err) { console.error(err); }

    });


    useEffect(() => {
        if (showAtsPages) {
            $('#ats-pages-dd').fadeIn();
        }
        else {
            $('#ats-pages-dd').fadeOut();
        }
    }, [showAtsPages]);


    useEffect(() => {
        if (showActions) {
            $('#actions-dd').fadeIn();
            $('#user-email').fadeIn();
        }
        else {
            $('#actions-dd').fadeOut();
            $('#user-email').fadeOut();
        }
    }, [showActions]);


    useEffect(() => {
        localStorage.setItem('isToolbarLocked', isToolbarLocked);
    }, [isToolbarLocked]);


    const actionsMenuItems = [
        {
            type: 'group',
            label: t('educational-materials'),
            children: [
                {
                    key: 'caderno_cidadania_financeira',
                    label: (
                        <SwitchableIcon
                            className='page-link-button'
                            showText={true}
                            staticImage={documentSvg}
                            onToggle={() => window.open(insightSourcesLinks['caderno_cidadania_financeira.pdf'], '_blank')}
                            text={t('caderno_cidadania_financeira.pdf')}
                        />
                    ),
                },
                {
                    key: 'cartilha_de_educacao_financeira',
                    label: (
                        <SwitchableIcon
                            className='page-link-button'
                            showText={true}
                            staticImage={documentSvg}
                            onToggle={() => window.open(insightSourcesLinks['cartilha_de_educacao_financeira.pdf'], '_blank')}
                            text={t('cartilha_de_educacao_financeira.pdf')}
                        />
                    ),
                },
                {
                    key: 'quem_sonha_poupa_ebook',
                    label: (
                        <SwitchableIcon
                            className='page-link-button'
                            showText={true}
                            staticImage={documentSvg}
                            onToggle={() => window.open(insightSourcesLinks['quem_sonha_poupa_ebook.pdf'], '_blank')}
                            text={t('quem_sonha_poupa_ebook.pdf')}
                        />
                    ),
                },
            ],
        },
        {
            type: 'group',
            label: t('corporate'),
            children: [
                {
                    key: 'cookies-policy',
                    label: (
                        <SwitchableIcon
                            className='page-link-button'
                            showText={true}
                            staticImage={documentSvg}
                            onToggle={() => window.open(cookiesPolicyDoc, '_blank')}
                            text={t('cookies.messages.title')}
                        />
                    ),
                },
                {
                    key: 'privacy-policy',
                    label: (
                        <SwitchableIcon
                            className='page-link-button'
                            showText={true}
                            staticImage={documentSvg}
                            onToggle={() => window.open(privacyPolicyDoc, '_blank')}
                            text={t('privacy-policy')}
                        />
                    ),
                },
                {
                    key: 'terms-of-service',
                    label: (
                        <SwitchableIcon
                            className='page-link-button'
                            showText={true}
                            staticImage={documentSvg}
                            onToggle={() => window.open(termsOfServiceDoc, '_blank')}
                            text={t('terms-of-service.p')}
                        />
                    ),
                },
            ],
        },
        {
            type: 'group',
            label: t('action.p'),
            children: [
                {
                    key: 'sign-out',
                    label: (
                        <SwitchableIcon id='sign-out-btn'
                            className='page-link-button'
                            showText={true}
                            staticImage={signOutSvg}
                            onToggle={() => setSignOutModalEnabled(true)}
                            text={t('sign.out.v')}
                        />
                    ),
                },
            ],
        },
    ];


    const signOutUser = async () => {
        const result = await sessionsMeDelete();

        localStorage.clear();
        sessionStorage.clear();

        if (result.isSuccess) navigate('/sign-in');
        else navigate('/unauthorized');
    };

    const getUser = async () => {

        const userResult = await usersMeGet();

        if (userResult && userResult.response)
            setUser(userResult.response);
    };


    const handleSignOutButton = (event) => {

        var option = event.target.id.replace('-btn', '');

        if (option === 'yes') signOutUser();
        else setSignOutModalEnabled(false);
    };


    const handleClickOutDialogModal = (event) => {

        event.preventDefault();

        if (event.target.classList.contains('sign-out-dialog') ||
            event.target.classList.contains('secondary')) {
            setSignOutModalEnabled(false);
        }
    };


    const handleMouseEnter = () => {
        timerRef.current = setTimeout(() => setIsHoverActive(true), 200);
    };


    const handleMouseLeave = () => {
        clearTimeout(timerRef.current);
        setIsHoverActive(false);
        setSelectedDropdown('');
    };


    return (
        <>
            <ConfirmSignOut
                handle={handleSignOutButton}
                handleClickOut={handleClickOutDialogModal}
                showDialog={signOutModalEnabled}
                text={t('are-you-ure-to-sing-out')}
            />

            <Column
                className={'browser' + (isHoverActive || isToolbarLocked ? ' hover' : '')}
                id='toolbar-container'
                j='between'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Column>
                    <Row id='logo-container'
                        fill='width'
                        g='0'
                    >
                        <img id='minhas-financas-logo-img' src={MinhasFinancasIconLogo128Png} alt='BNX Logo' />

                        <img id='st-logo-img' src={MinhasFinancasExtLogoSvg} alt='Minhas Finanças Logo' />
                    </Row>

                    <Column id='pages'
                        className='toolbar'
                        g='0'
                    >
                        <PageLink
                            id='overview-page-link'
                            isSelected={page === 'overview'}
                            route='/overview'
                            showText={true}
                            svgIcon={overviewSvg}
                            text={t('overview')}
                        />

                        <PageLink
                            id='settings-page-link'
                            isSelected={page === 'settings'}
                            route='/settings'
                            showText={true}
                            svgIcon={settingsSvg}
                            text={t('settings')}
                        />
                    </Column>
                </Column>

                <Column id='user-preferences'
                    className='toolbar'
                >
                    <Column g='0'>
                        <Dropdown
                            menu={{
                                items: actionsMenuItems,
                            }}
                            trigger={['click']}
                            placement="topLeft"
                        >
                            {user
                                ? <Row id='session-user'
                                    className='page-link-button'
                                    fill='width'
                                    title={`${user.fullname} (${user.username}) [${user.role}]`}
                                >
                                    <Gravatar
                                        email={user.username}
                                        id='session-pic'
                                        size={32}
                                        rating='pg'
                                    />

                                    <p id='session-fullname'>{user.fullname}</p>
                                </Row>
                                : <></>
                            }
                        </Dropdown>
                    </Column>

                    <Button id='lock-button'
                        onClick={() => setIsToolbarLocked(!isToolbarLocked)}
                        variation='secondary'
                    >
                        {isToolbarLocked ? lockIcon : unlockIcon}
                    </Button>
                </Column>
            </Column>
        </>
    );
};


Toolbar.propTypes = {
    page: PropTypes.string
};


export default Toolbar;