/* eslint-disable @typescript-eslint/no-unused-vars */
// Common Imports (used in multiple pages)
import React, { useEffect, useState } from 'react'; // React
import { useLocation } from 'react-router-dom'; // React Router

import i18n from 'locales/i18n';
import $ from 'jquery'; // JQuery

// React-i18next
import { useTranslation } from 'react-i18next';

// Element Components
import {
    Column, CookiesPolicyModal, MessagePopup, Row, Layout, Loading,
    Page, Panel, Title, SwitchableIcon, Button
} from 'components/imports'; // Layout

import {
    getAgreedCookiesPolicy, getLanguage, getTheme,
    setAgreedCookiesPolicy
} from 'utils/cookies';

// PDF
import { cookiesPolicyDoc } from 'constants';

import { AddSvg, AiSvg, RefreshSvg } from 'icons/imports';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { insightMePost } from 'apis/imports';

import { currencyFormatter } from 'utils/formatters';

import Skeleton from 'react-loading-skeleton';

import ConnectAccountModal from './components/ConnectAccountModal';

import 'react-loading-skeleton/dist/skeleton.css';

// Styles
import './Overview.css';


const Overview = () => {

    const location = useLocation();
    const { t } = useTranslation();

    const pageId = 'overview';

    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);

    const [showCookiesDialog, setShowCookiesDialog] = useState(false);

    const [appLang,] = useState(getLanguage());
    const [appTheme,] = useState(getTheme());

    const [popUpDuration,] = useState(3000);
    const [popUpLevel,] = useState('warning');
    const [popUpText,] = useState('-');

    const [totalBalance, setTotalBalance] = useState(0);
    const [bankBalance, setBankBalance] = useState(0);
    const [creditBalance, setCreditBalance] = useState(0);
    const [investmentsBalance, setInvestmentsBalance] = useState(0);

    const [bankData, setBankData] = useState({});
    const [creditData, setCreditData] = useState({});

    const [loadingAccounts, setLoadingAccounts] = useState(true);

    const [insight, setInsight] = useState('');
    const [loadingInsight, setLoadingInsight] = useState(true);

    const [isConnectAccountModalVisible, setIsConnectAccountModalVisible] = useState(false);

    const [investimentsList, setinvestimentsList] = useState([]);
    const [loadingInvestments, setLoadingInvestments] = useState(true);

    const aiIcon = <AiSvg className='icon-svg' />;
    const addIcon = <AddSvg className='icon-svg' />;


    useEffect(() => {
        if (location.pathname === `/${pageId}`) {
            document.title = `${t('overview')} - Minhas Finanças`;

            setShowCookiesDialog(!getAgreedCookiesPolicy());

            getAccounts();
            getInsight();
            getInvestments();
        }
    }, [location.pathname]);


    $('.reactour__close-button').on('click', function () {
        document.getElementById('toolbar-container').classList.remove('stepping');
    });


    $('.reactour__mask').on('click', function () {
        document.getElementById('toolbar-container').classList.remove('stepping');
    });


    useEffect(() => {
        document.body.classList.remove('bright', 'dark');
        document.body.classList.add(appTheme);
        i18n.changeLanguage(appLang);
    }, [appTheme, appLang]);


    useEffect(() => {
        setTotalBalance(creditBalance + bankBalance + investmentsBalance);
    }, [creditBalance, bankBalance, investmentsBalance]);

    const handleIAgreeButton = (event) => {
        var option = event.target.id.replace('-btn', '');
        if (option === 'yes') {
            setAgreedCookiesPolicy();
            setShowCookiesDialog(false);
        }
    };


    const handleLearnMoreButton = (event) => {
        var option = event.target.id.replace('-btn', '');
        if (option === 'no') window.open(cookiesPolicyDoc);
    };


    const getAccounts = () => {

        if (!isUserAuthenticated) return;

        setLoadingAccounts(true);

        setTimeout(() => {

            const response = [
                {
                    'id': 'bb6ded08-bd4f-4318-930a-9322ebeb50a9',
                    'type': 'BANK',
                    'subtype': 'CHECKING_ACCOUNT',
                    'name': 'Conta Corrente',
                    'balance': 31264.54,
                    'currencyCode': 'BRL',
                    'itemId': '23a7d313-881f-4e7b-939f-bea8ed7b8b0d',
                    'number': '0001/12345-0',
                    'createdAt': '2024-12-04T22:18:37.992Z',
                    'updatedAt': '2024-12-04T22:18:37.992Z',
                    'marketingName': 'GOLD Conta Corrente',
                    'taxNumber': '416.799.495-00',
                    'owner': 'John Doe',
                    'bankData': {
                        'transferNumber': '123/0001/12345-0',
                        'closingBalance': 31264.54,
                        'automaticallyInvestedBalance': 3126.454,
                        'overdraftContractedLimit': null,
                        'overdraftUsedLimit': null,
                        'unarrangedOverdraftAmount': null
                    },
                    'creditData': null,
                    'transactions': [
                        {
                            'id': '090f5183-5839-443d-b42c-f6dc054ae659',
                            'description': 'DL*GOOGLEYouTube',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 18.99,
                            'amountInAccountCurrency': null,
                            'date': '2024-10-20T03:00:00.000Z',
                            'category': 'Digital services',
                            'categoryId': '09000000',
                            'balance': null,
                            'accountId': 'bb6ded08-bd4f-4318-930a-9322ebeb50a9',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'CREDIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '6319400',
                                'cnpj': '06990590000123',
                                'name': '',
                                'category': 'Internet',
                                'businessName': 'GOOGLE BRASIL INTERNET LTDA.'
                            },
                            'createdAt': '2024-12-04T22:18:38.192Z',
                            'updatedAt': '2024-12-04T22:18:38.192Z'
                        },
                        {
                            'id': '44621a7b-ea96-446c-983a-8a33732abe9e',
                            'description': 'DA VIVO-SP 11265173793',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': -50,
                            'amountInAccountCurrency': null,
                            'date': '2024-03-01T03:00:00.000Z',
                            'category': 'Telecommunications',
                            'categoryId': '07010000',
                            'balance': null,
                            'accountId': 'bb6ded08-bd4f-4318-930a-9322ebeb50a9',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': {
                                'payer': null,
                                'paymentMethod': null,
                                'reason': null,
                                'receiver': {
                                    'accountNumber': null,
                                    'branchNumber': null,
                                    'documentNumber': {
                                        'type': 'CPF',
                                        'value': '11265173793'
                                    },
                                    'name': null,
                                    'routingNumber': null,
                                    'routingNumberISPB': null
                                },
                                'receiverReferenceId': null,
                                'referenceNumber': null,
                                'boletoMetadata': null
                            },
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': null,
                            'createdAt': '2024-12-04T22:18:38.192Z',
                            'updatedAt': '2024-12-04T22:18:38.192Z'
                        },
                        {
                            'id': '93f7eb03-a86a-4e54-8212-1f7b3f01a791',
                            'description': 'TRANSFERÊNCIA REEBIDA',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 8900,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-28T03:00:00.000Z',
                            'category': 'Transfers',
                            'categoryId': '05000000',
                            'balance': null,
                            'accountId': 'bb6ded08-bd4f-4318-930a-9322ebeb50a9',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'CREDIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': null,
                            'createdAt': '2024-12-04T22:18:38.192Z',
                            'updatedAt': '2024-12-04T22:18:38.192Z'
                        },
                        {
                            'id': 'f151f7f2-8b30-4615-a7fc-2e2dcfe71716',
                            'description': 'RESGATE FUNDO',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 13230,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-27T03:00:00.000Z',
                            'category': 'Mutual funds',
                            'categoryId': '03030000',
                            'balance': null,
                            'accountId': 'bb6ded08-bd4f-4318-930a-9322ebeb50a9',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'CREDIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': null,
                            'createdAt': '2024-12-04T22:18:38.192Z',
                            'updatedAt': '2024-12-04T22:18:38.192Z'
                        },
                        {
                            'id': 'cf372c49-46b0-46e5-8ac6-447d1f1f935a',
                            'description': 'DEBITO VISA ELECTRON BRASIL PAO DE ACUCAR ',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 130.55,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-10T03:00:00.000Z',
                            'category': 'Groceries',
                            'categoryId': '10000000',
                            'balance': null,
                            'accountId': 'bb6ded08-bd4f-4318-930a-9322ebeb50a9',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'CREDIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '4711302',
                                'cnpj': '47508411176351',
                                'name': 'PAO DE ACUCAR - SUPERMERCADO',
                                'category': 'Food and drinks',
                                'businessName': 'COMPANHIA BRASILEIRA DE DISTRIBUICAO'
                            },
                            'createdAt': '2024-12-04T22:18:38.192Z',
                            'updatedAt': '2024-12-04T22:18:38.192Z'
                        },
                        {
                            'id': '681d4a37-980c-4c71-9393-836573a3ab2f',
                            'description': 'Uber *uber *eats',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 60,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-09T03:00:00.000Z',
                            'category': 'Taxi and ride-hailing',
                            'categoryId': '19010000',
                            'balance': null,
                            'accountId': 'bb6ded08-bd4f-4318-930a-9322ebeb50a9',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'CREDIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '7490104',
                                'cnpj': '17895646000187',
                                'name': '',
                                'category': 'Services',
                                'businessName': 'UBER DO BRASIL TECNOLOGIA LTDA.'
                            },
                            'createdAt': '2024-12-04T22:18:38.192Z',
                            'updatedAt': '2024-12-04T22:18:38.192Z'
                        },
                        {
                            'id': '1dde7960-655b-41a1-9238-4055f1980493',
                            'description': 'IFOOD    *IFOOD',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 35,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-08T03:00:00.000Z',
                            'category': 'Food delivery',
                            'categoryId': '11020000',
                            'balance': null,
                            'accountId': 'bb6ded08-bd4f-4318-930a-9322ebeb50a9',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'CREDIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '7490104',
                                'cnpj': '14380200000121',
                                'name': '',
                                'category': 'Services',
                                'businessName': 'IFOOD.COM AGENCIA DE RESTAURANTES ONLINE S.A.'
                            },
                            'createdAt': '2024-12-04T22:18:38.192Z',
                            'updatedAt': '2024-12-04T22:18:38.192Z'
                        },
                        {
                            'id': 'c891e2c6-3d37-4e52-88c7-5fa7bbe109a1',
                            'description': 'INT SKY BRASI ',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 40,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-05T03:00:00.000Z',
                            'category': 'TV',
                            'categoryId': '07010003',
                            'balance': null,
                            'accountId': 'bb6ded08-bd4f-4318-930a-9322ebeb50a9',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'CREDIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnpj': '',
                                'name': 'sky brasi',
                                'businessName': ''
                            },
                            'createdAt': '2024-12-04T22:18:38.192Z',
                            'updatedAt': '2024-12-04T22:18:38.192Z'
                        },
                        {
                            'id': 'e3e74da0-c94e-4aed-8690-573957d8e9a1',
                            'description': 'TRANSFERÊNCIA REEBIDA',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 8900,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-02T03:00:00.000Z',
                            'category': 'Transfers',
                            'categoryId': '05000000',
                            'balance': null,
                            'accountId': 'bb6ded08-bd4f-4318-930a-9322ebeb50a9',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'CREDIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': null,
                            'createdAt': '2024-12-04T22:18:38.192Z',
                            'updatedAt': '2024-12-04T22:18:38.192Z'
                        }
                    ]
                },
                {
                    'id': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                    'type': 'CREDIT',
                    'subtype': 'CREDIT_CARD',
                    'name': 'Mastercard Black',
                    'balance': 745.22,
                    'currencyCode': 'BRL',
                    'itemId': '23a7d313-881f-4e7b-939f-bea8ed7b8b0d',
                    'number': '9437',
                    'createdAt': '2024-12-04T22:18:38.373Z',
                    'updatedAt': '2024-12-04T22:18:38.373Z',
                    'marketingName': 'PLUGGY UNICLASS MASTERCARD BLACK',
                    'taxNumber': null,
                    'owner': null,
                    'bankData': null,
                    'creditData': {
                        'level': 'BLACK',
                        'brand': 'MASTERCARD',
                        'balanceCloseDate': '2024-12-04',
                        'balanceDueDate': '2024-12-09',
                        'availableCreditLimit': 300000,
                        'balanceForeignCurrency': null,
                        'minimumPayment': 149.044,
                        'creditLimit': 300000,
                        'isLimitFlexible': false,
                        'holderType': 'MAIN',
                        'status': 'ACTIVE'
                    },
                    'transactions': [
                        {
                            'id': 'e4cefba4-a437-4f2d-9b80-f4b48bd250b7',
                            'description': 'Netflix.com',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 54.99,
                            'amountInAccountCurrency': null,
                            'date': '2024-09-25T03:00:00.000Z',
                            'category': 'Video streaming',
                            'categoryId': '09020000',
                            'balance': null,
                            'accountId': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '8211300',
                                'cnpj': '13590585000199',
                                'name': '',
                                'category': 'Services',
                                'businessName': 'NETFLIX ENTRETENIMENTO BRASIL LTDA.'
                            },
                            'createdAt': '2024-12-04T22:18:38.497Z',
                            'updatedAt': '2024-12-04T22:18:38.497Z'
                        },
                        {
                            'id': '73c715d9-7c61-4d63-ad46-d8adc199c04e',
                            'description': 'Netflix.com',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 54.99,
                            'amountInAccountCurrency': null,
                            'date': '2024-08-25T03:00:00.000Z',
                            'category': 'Video streaming',
                            'categoryId': '09020000',
                            'balance': null,
                            'accountId': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '8211300',
                                'cnpj': '13590585000199',
                                'name': '',
                                'category': 'Services',
                                'businessName': 'NETFLIX ENTRETENIMENTO BRASIL LTDA.'
                            },
                            'createdAt': '2024-12-04T22:18:38.497Z',
                            'updatedAt': '2024-12-04T22:18:38.497Z'
                        },
                        {
                            'id': '646db963-1366-4765-9456-9851041d14f1',
                            'description': 'ANUIDADE DIFERENCIADA',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 30.99,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-28T03:00:00.000Z',
                            'category': 'Credit card fees',
                            'categoryId': '16030000',
                            'balance': null,
                            'accountId': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': null,
                            'createdAt': '2024-12-04T22:18:38.497Z',
                            'updatedAt': '2024-12-04T22:18:38.497Z'
                        },
                        {
                            'id': 'f25c0427-4126-4b1e-bca2-0aaea516e9ae',
                            'description': 'Netflix.com',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 54.99,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-25T03:00:00.000Z',
                            'category': 'Video streaming',
                            'categoryId': '09020000',
                            'balance': null,
                            'accountId': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '8211300',
                                'cnpj': '13590585000199',
                                'name': '',
                                'category': 'Services',
                                'businessName': 'NETFLIX ENTRETENIMENTO BRASIL LTDA.'
                            },
                            'createdAt': '2024-12-04T22:18:38.497Z',
                            'updatedAt': '2024-12-04T22:18:38.497Z'
                        },
                        {
                            'id': '7bf3a329-8aeb-4bc4-a021-b6562d0de6ed',
                            'description': 'DL*GOOGLEYouTube',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 18.99,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-20T03:00:00.000Z',
                            'category': 'Digital services',
                            'categoryId': '09000000',
                            'balance': null,
                            'accountId': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '6319400',
                                'cnpj': '06990590000123',
                                'name': '',
                                'category': 'Internet',
                                'businessName': 'GOOGLE BRASIL INTERNET LTDA.'
                            },
                            'createdAt': '2024-12-04T22:18:38.497Z',
                            'updatedAt': '2024-12-04T22:18:38.497Z'
                        },
                        {
                            'id': '3dd5d1ef-7e10-431b-b530-8e0f428c14aa',
                            'description': 'LAVA RAPIDO',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 30.3,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-15T03:00:00.000Z',
                            'category': 'Vehicle maintenance',
                            'categoryId': '19050005',
                            'balance': null,
                            'accountId': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': null,
                            'createdAt': '2024-12-04T22:18:38.497Z',
                            'updatedAt': '2024-12-04T22:18:38.497Z'
                        },
                        {
                            'id': '6ede05c0-6e4e-4d3e-b4f9-07582a61f213',
                            'description': 'Rappi*rappi Brasil Int',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 80.99,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-10T03:00:00.000Z',
                            'category': 'Food delivery',
                            'categoryId': '11020000',
                            'balance': null,
                            'accountId': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '7490104',
                                'cnpj': '26900161000125',
                                'name': 'RAPPI',
                                'category': 'Services',
                                'businessName': 'RAPPI BRASIL INTERMEDIACAO DE NEGOCIOS LTDA'
                            },
                            'createdAt': '2024-12-04T22:18:38.497Z',
                            'updatedAt': '2024-12-04T22:18:38.497Z'
                        },
                        {
                            'id': '30c8887d-623c-4273-b15c-0bf2acfd52be',
                            'description': 'Uber *trip',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 45,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-05T03:00:00.000Z',
                            'category': 'Taxi and ride-hailing',
                            'categoryId': '19010000',
                            'balance': null,
                            'accountId': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '7490104',
                                'cnpj': '17895646000187',
                                'name': '',
                                'category': 'Services',
                                'businessName': 'UBER DO BRASIL TECNOLOGIA LTDA.'
                            },
                            'createdAt': '2024-12-04T22:18:38.497Z',
                            'updatedAt': '2024-12-04T22:18:38.497Z'
                        },
                        {
                            'id': 'b60376fb-ef81-4bc1-ab95-77e0c7f9a0e9',
                            'description': 'Mercpag*mercadoliv02/06',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 300,
                            'amountInAccountCurrency': null,
                            'date': '2024-02-01T03:00:00.000Z',
                            'category': 'Online shopping',
                            'categoryId': '08010000',
                            'balance': null,
                            'accountId': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': null,
                            'createdAt': '2024-12-04T22:18:38.497Z',
                            'updatedAt': '2024-12-04T22:18:38.497Z'
                        },
                        {
                            'id': 'b46bae9f-e34b-490c-b185-1125bfb22bc2',
                            'description': 'Netflix.com',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 54.99,
                            'amountInAccountCurrency': null,
                            'date': '2024-01-25T03:00:00.000Z',
                            'category': 'Video streaming',
                            'categoryId': '09020000',
                            'balance': null,
                            'accountId': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': {
                                'installmentNumber': 2,
                                'totalInstallments': 6,
                                'totalAmount': 329.94,
                                'payeeMCC': 5812,
                                'billId': 'e4503a46-b2b0-4081-81fa-afaa18d2cd62'
                            },
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '8211300',
                                'cnpj': '13590585000199',
                                'name': '',
                                'category': 'Services',
                                'businessName': 'NETFLIX ENTRETENIMENTO BRASIL LTDA.'
                            },
                            'createdAt': '2024-12-04T22:18:38.497Z',
                            'updatedAt': '2024-12-04T22:18:38.497Z'
                        },
                        {
                            'id': '8a1aa44f-7303-49f8-892b-58ab7f200152',
                            'description': 'DL*GOOGLEYouTube',
                            'descriptionRaw': null,
                            'currencyCode': 'BRL',
                            'amount': 18.99,
                            'amountInAccountCurrency': null,
                            'date': '2024-01-20T03:00:00.000Z',
                            'category': 'Digital services',
                            'categoryId': '09000000',
                            'balance': null,
                            'accountId': '577ec13e-d212-4cf1-9b81-aa467a164b89',
                            'providerCode': null,
                            'status': 'POSTED',
                            'paymentData': null,
                            'type': 'DEBIT',
                            'operationType': null,
                            'creditCardMetadata': null,
                            'acquirerData': null,
                            'merchant': {
                                'cnae': '6319400',
                                'cnpj': '06990590000123',
                                'name': '',
                                'category': 'Internet',
                                'businessName': 'GOOGLE BRASIL INTERNET LTDA.'
                            },
                            'createdAt': '2024-12-04T22:18:38.497Z',
                            'updatedAt': '2024-12-04T22:18:38.497Z'
                        }
                    ]
                }
            ];

            const bankData = response.filter((item) => item.type == 'BANK')[0];
            const creditData = response.filter((item) => item.type == 'CREDIT')[0];

            setBankData(bankData);
            setCreditData(creditData);

            setBankBalance(bankData.bankData.closingBalance);
            setCreditBalance(creditData.creditData.creditLimit - creditData.balance);

            setLoadingAccounts(false);
        }, 2000);
    };


    const getInsight = async (message) => {

        if (!isUserAuthenticated) return;

        setLoadingInsight(true);

        // const response = await insightMePost({ message });
        setTimeout(() => {
            message;
            const response = {
                isSuccess: true,
                response: {
                    insight: 'Reduzir gastos com serviços e delivery pode ajudar a maximizar o benefício das transferências.'
                }
            };

            if (response.isSuccess) {
                setInsight(response.response.insight);
            }

            setLoadingInsight(false);
        }, 2000);
    };


    const getInvestments = async () => {

        if (!isUserAuthenticated) return;

        setLoadingInvestments(true);

        setTimeout(() => {
            const response = [
                {
                    'id': '2ea19a82-c551-4df7-86ad-3ea281d67f8c',
                    'number': '123456-3',
                    'name': 'Fondo de Investimento Basic',
                    'balance': 2000,
                    'currencyCode': 'BRL',
                    'type': 'MUTUAL_FUND',
                    'subtype': 'INVESTMENT_FUND',
                    'lastMonthRate': 0.2,
                    'lastTwelveMonthsRate': 1,
                    'annualRate': 1.24,
                    'itemId': '23a7d313-881f-4e7b-939f-bea8ed7b8b0d',
                    'code': '12.345.678/0001-02',
                    'isin': null,
                    'metadata': null,
                    'value': 250,
                    'quantity': 10,
                    'amount': 2500,
                    'taxes': 400,
                    'taxes2': 100,
                    'date': '2024-12-04T22:18:28.167Z',
                    'owner': 'John Doe',
                    'amountProfit': 500,
                    'amountWithdrawal': 2500,
                    'amountOriginal': 2000,
                    'dueDate': null,
                    'issuer': null,
                    'issuerCNPJ': null,
                    'issueDate': null,
                    'rate': null,
                    'rateType': null,
                    'fixedAnnualRate': null,
                    'status': 'ACTIVE',
                    'institution': null,
                    'createdAt': '2024-12-04T22:18:39.445Z',
                    'updatedAt': '2024-12-04T22:18:39.445Z',
                    'transactions': [
                        {
                            'id': '339f9500-5378-4b72-8abe-e43fed6d5ac6',
                            'amount': 100,
                            'description': 'Resgate Fondo de Investimento Basic',
                            'value': 50,
                            'quantity': 2,
                            'tradeDate': '2021-09-15T00:00:00.000Z',
                            'date': '2021-09-15T00:00:00.000Z',
                            'type': 'SELL',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'DEBIT'
                        },
                        {
                            'id': 'c1e5aa7f-1cde-45a1-8416-ea19a2e9fc67',
                            'amount': 100,
                            'description': 'Aplicação Fondo de Investimento Basic',
                            'value': 50,
                            'quantity': 2,
                            'tradeDate': '2021-09-01T00:00:00.000Z',
                            'date': '2021-09-01T00:00:00.000Z',
                            'type': 'BUY',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'CREDIT'
                        },
                        {
                            'id': 'ba47506f-8994-46b4-a33c-58b2c00379cf',
                            'amount': 60,
                            'description': 'Aplicação Fondo de Investimento Basic',
                            'value': 20,
                            'quantity': 3,
                            'tradeDate': '2021-08-15T00:00:00.000Z',
                            'date': '2021-08-15T00:00:00.000Z',
                            'type': 'BUY',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'CREDIT'
                        }
                    ]
                },
                {
                    'id': 'db1162b1-f1cc-4aed-9582-e5c6fb0fc877',
                    'number': '123456-4',
                    'name': 'CDR',
                    'balance': 2000,
                    'currencyCode': 'BRL',
                    'type': 'FIXED_INCOME',
                    'subtype': 'CDB',
                    'lastMonthRate': null,
                    'lastTwelveMonthsRate': null,
                    'annualRate': null,
                    'itemId': '23a7d313-881f-4e7b-939f-bea8ed7b8b0d',
                    'code': '0001-02',
                    'isin': '123456789',
                    'metadata': null,
                    'value': null,
                    'quantity': null,
                    'amount': 2500,
                    'taxes': null,
                    'taxes2': null,
                    'date': '2024-12-04T22:18:28.167Z',
                    'owner': 'John Doe',
                    'amountProfit': 0,
                    'amountWithdrawal': 2000,
                    'amountOriginal': 2000,
                    'dueDate': '2024-12-04T22:18:28.167Z',
                    'issuer': 'Banco do Pluggy',
                    'issuerCNPJ': null,
                    'issueDate': '2024-12-04T22:18:28.167Z',
                    'rate': 150,
                    'rateType': 'CDI',
                    'fixedAnnualRate': 2.5,
                    'status': 'ACTIVE',
                    'institution': {
                        'name': 'BANCO BTG PACTUAL S/A',
                        'number': '30306294000145'
                    },
                    'createdAt': '2024-12-04T22:18:39.479Z',
                    'updatedAt': '2024-12-04T22:18:39.479Z',
                    'transactions': []
                },
                {
                    'id': '5eecc31b-4610-4c55-8ea0-e5a129d67ac8',
                    'number': '123456-2',
                    'name': 'Pluggy PREVIDENCIA',
                    'balance': 1359.39,
                    'currencyCode': 'BRL',
                    'type': 'SECURITY',
                    'subtype': 'RETIREMENT',
                    'lastMonthRate': 0.2,
                    'lastTwelveMonthsRate': null,
                    'annualRate': 3.24,
                    'itemId': '23a7d313-881f-4e7b-939f-bea8ed7b8b0d',
                    'code': null,
                    'isin': null,
                    'metadata': null,
                    'value': 500,
                    'quantity': 3,
                    'amount': 1500,
                    'taxes': 0,
                    'taxes2': 0,
                    'date': '2024-12-04T22:18:28.167Z',
                    'owner': 'John Doe',
                    'amountProfit': 359.39,
                    'amountWithdrawal': 1310.5,
                    'amountOriginal': 1000,
                    'dueDate': '2024-12-04T22:18:28.167Z',
                    'issuer': 'Banco do Pluggy',
                    'issuerCNPJ': null,
                    'issueDate': '2024-12-04T22:18:28.167Z',
                    'rate': null,
                    'rateType': null,
                    'fixedAnnualRate': null,
                    'status': 'ACTIVE',
                    'institution': null,
                    'createdAt': '2024-12-04T22:18:40.119Z',
                    'updatedAt': '2024-12-04T22:18:40.119Z',
                    'transactions': []
                },
                {
                    'id': 'cc5d976f-b55a-466b-a4d3-82db742d2ea9',
                    'number': null,
                    'name': 'ISUS11 STOCK',
                    'balance': 2000,
                    'currencyCode': 'BRL',
                    'type': 'ETF',
                    'subtype': 'ETF',
                    'lastMonthRate': 0.2,
                    'lastTwelveMonthsRate': null,
                    'annualRate': null,
                    'itemId': '23a7d313-881f-4e7b-939f-bea8ed7b8b0d',
                    'code': 'ISUS11',
                    'isin': '123456789',
                    'metadata': null,
                    'value': null,
                    'quantity': 1,
                    'amount': 2000,
                    'taxes': null,
                    'taxes2': null,
                    'date': '2024-12-04T22:18:28.167Z',
                    'owner': 'John Doe',
                    'amountProfit': 0,
                    'amountWithdrawal': 2000,
                    'amountOriginal': 2000,
                    'dueDate': null,
                    'issuer': 'IT NOW ISE FUNDO DE ÍNDICE',
                    'issuerCNPJ': null,
                    'issueDate': null,
                    'rate': null,
                    'rateType': null,
                    'fixedAnnualRate': null,
                    'status': 'ACTIVE',
                    'institution': null,
                    'createdAt': '2024-12-04T22:18:40.150Z',
                    'updatedAt': '2024-12-04T22:18:40.150Z',
                    'transactions': [
                        {
                            'id': '615ce49a-c576-43ca-be39-3b1bfb6e5a6e',
                            'amount': 249.99,
                            'description': null,
                            'value': 249.99,
                            'quantity': 1,
                            'tradeDate': '2021-09-15T00:00:00.000Z',
                            'date': '2021-09-15T00:00:00.000Z',
                            'type': 'SELL',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'DEBIT'
                        },
                        {
                            'id': '43328fdc-03ed-450c-881c-191eeab98dad',
                            'amount': 750,
                            'description': null,
                            'value': 750,
                            'quantity': 1,
                            'tradeDate': '2021-09-01T00:00:00.000Z',
                            'date': '2021-09-01T00:00:00.000Z',
                            'type': 'BUY',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'CREDIT'
                        },
                        {
                            'id': '0ad1ee1c-b229-4e56-887a-5f2ddbb33396',
                            'amount': 1499.99,
                            'description': null,
                            'value': 1499.99,
                            'quantity': 1,
                            'tradeDate': '2021-08-15T00:00:00.000Z',
                            'date': '2021-08-15T00:00:00.000Z',
                            'type': 'BUY',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'CREDIT'
                        }
                    ]
                },
                {
                    'id': 'eba96073-e0ca-41ce-91d5-d9c8da9dd19d',
                    'number': null,
                    'name': 'GGRC11',
                    'balance': 118.4,
                    'currencyCode': 'BRL',
                    'type': 'EQUITY',
                    'subtype': 'REAL_ESTATE_FUND',
                    'lastMonthRate': null,
                    'lastTwelveMonthsRate': null,
                    'annualRate': null,
                    'itemId': '23a7d313-881f-4e7b-939f-bea8ed7b8b0d',
                    'code': 'GGRC11',
                    'isin': 'BRGGRCCTF002',
                    'metadata': null,
                    'value': 118.4,
                    'quantity': 1,
                    'amount': 118.4,
                    'taxes': null,
                    'taxes2': null,
                    'date': '2024-12-04T22:18:28.167Z',
                    'owner': null,
                    'amountProfit': null,
                    'amountWithdrawal': 118.4,
                    'amountOriginal': 119,
                    'dueDate': null,
                    'issuer': 'GGR COVEPI RENDA FDO INV IMOB',
                    'issuerCNPJ': null,
                    'issueDate': null,
                    'rate': null,
                    'rateType': null,
                    'fixedAnnualRate': null,
                    'status': 'ACTIVE',
                    'institution': null,
                    'createdAt': '2024-12-04T22:18:40.213Z',
                    'updatedAt': '2024-12-04T22:18:40.213Z',
                    'transactions': [
                        {
                            'id': '7bfb2d66-cebc-4bdb-8e6b-b1ea355efc81',
                            'amount': 125.38,
                            'description': null,
                            'value': 125.38,
                            'quantity': 1,
                            'tradeDate': '2021-09-15T00:00:00.000Z',
                            'date': '2021-09-15T00:00:00.000Z',
                            'type': 'SELL',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'DEBIT'
                        },
                        {
                            'id': 'd053d73e-32c8-4e1f-9ed8-03ba875baf4c',
                            'amount': 128.41,
                            'description': null,
                            'value': 128.41,
                            'quantity': 1,
                            'tradeDate': '2021-09-01T00:00:00.000Z',
                            'date': '2021-09-01T00:00:00.000Z',
                            'type': 'BUY',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'CREDIT'
                        },
                        {
                            'id': 'e21dd073-512b-4ee2-a819-5fc55058ff2e',
                            'amount': 134.99,
                            'description': null,
                            'value': 134.99,
                            'quantity': 1,
                            'tradeDate': '2021-08-15T00:00:00.000Z',
                            'date': '2021-08-15T00:00:00.000Z',
                            'type': 'BUY',
                            'netAmount': null,
                            'brokerageNumber': '123456-1',
                            'expenses': null,
                            'movementType': 'CREDIT'
                        }
                    ]
                },
                {
                    'id': '62d7682f-42d9-45ac-93a0-171fb9bf2425',
                    'number': null,
                    'name': 'BOVA11',
                    'balance': 118.4,
                    'currencyCode': 'BRL',
                    'type': 'ETF',
                    'subtype': 'ETF',
                    'lastMonthRate': null,
                    'lastTwelveMonthsRate': null,
                    'annualRate': null,
                    'itemId': '23a7d313-881f-4e7b-939f-bea8ed7b8b0d',
                    'code': 'BOVA11',
                    'isin': 'BRBOVACTF003',
                    'metadata': null,
                    'value': 118.4,
                    'quantity': 0,
                    'amount': 118.4,
                    'taxes': null,
                    'taxes2': null,
                    'date': '2024-12-04T22:18:28.167Z',
                    'owner': null,
                    'amountProfit': null,
                    'amountWithdrawal': 118.4,
                    'amountOriginal': 119,
                    'dueDate': null,
                    'issuer': 'ISTOCK IBOVESPA FUNDO DE ÍNDICE',
                    'issuerCNPJ': null,
                    'issueDate': null,
                    'rate': null,
                    'rateType': null,
                    'fixedAnnualRate': null,
                    'status': 'TOTAL_WITHDRAWAL',
                    'institution': null,
                    'createdAt': '2024-12-04T22:18:40.255Z',
                    'updatedAt': '2024-12-04T22:18:40.255Z',
                    'transactions': [
                        {
                            'id': 'db35c02e-8d1c-4c29-badf-f1ccc7f1f8ce',
                            'amount': 125.38,
                            'description': null,
                            'value': 125.38,
                            'quantity': 1,
                            'tradeDate': '2021-09-15T00:00:00.000Z',
                            'date': '2021-09-15T00:00:00.000Z',
                            'type': 'BUY',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'CREDIT'
                        },
                        {
                            'id': 'd2a6d588-3aea-4e43-81c3-7779873d6cd2',
                            'amount': 128.41,
                            'description': null,
                            'value': 128.41,
                            'quantity': 1,
                            'tradeDate': '2021-08-15T00:00:00.000Z',
                            'date': '2021-08-15T00:00:00.000Z',
                            'type': 'SELL',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'DEBIT'
                        }
                    ]
                },
                {
                    'id': 'deae0791-e1e9-4254-bc2d-63af11991675',
                    'number': '123-4',
                    'name': 'ITAU Sandbox previdencia',
                    'balance': 11720.42,
                    'currencyCode': 'BRL',
                    'type': 'SECURITY',
                    'subtype': 'PGBL',
                    'lastMonthRate': -0.8,
                    'lastTwelveMonthsRate': 5.97,
                    'annualRate': 7.64,
                    'itemId': '23a7d313-881f-4e7b-939f-bea8ed7b8b0d',
                    'code': '07.400.588/0001-10',
                    'isin': null,
                    'metadata': null,
                    'value': 3.605103,
                    'quantity': null,
                    'amount': 1720.42,
                    'taxes': null,
                    'taxes2': null,
                    'date': '2024-12-04T22:18:28.167Z',
                    'owner': 'John Doe',
                    'amountProfit': null,
                    'amountWithdrawal': 1570.42,
                    'amountOriginal': null,
                    'dueDate': null,
                    'issuer': 'ITAU UNIBANCO ASSET MANAGEMENT LTDA',
                    'issuerCNPJ': '40.430.971/0001-96',
                    'issueDate': null,
                    'rate': null,
                    'rateType': null,
                    'fixedAnnualRate': null,
                    'status': 'ACTIVE',
                    'institution': null,
                    'createdAt': '2024-12-04T22:18:38.578Z',
                    'updatedAt': '2024-12-04T22:18:38.578Z',
                    'transactions': []
                },
                {
                    'id': '29c0427a-79f5-4057-b19e-fa09ba84c406',
                    'number': '123456-1',
                    'name': 'Fondo de Investimento Premium',
                    'balance': 1359.39,
                    'currencyCode': 'BRL',
                    'type': 'MUTUAL_FUND',
                    'subtype': 'INVESTMENT_FUND',
                    'lastMonthRate': 0.2,
                    'lastTwelveMonthsRate': null,
                    'annualRate': 3.24,
                    'itemId': '23a7d313-881f-4e7b-939f-bea8ed7b8b0d',
                    'code': '12.345.678/0001-00',
                    'isin': '123456789',
                    'metadata': null,
                    'value': 500,
                    'quantity': 3,
                    'amount': 1500,
                    'taxes': 40.61,
                    'taxes2': 100,
                    'date': '2024-12-04T22:18:28.167Z',
                    'owner': 'John Doe',
                    'amountProfit': 359.39,
                    'amountWithdrawal': 1310.5,
                    'amountOriginal': 1000,
                    'dueDate': null,
                    'issuer': null,
                    'issuerCNPJ': null,
                    'issueDate': null,
                    'rate': null,
                    'rateType': null,
                    'fixedAnnualRate': null,
                    'status': 'ACTIVE',
                    'institution': null,
                    'createdAt': '2024-12-04T22:18:39.011Z',
                    'updatedAt': '2024-12-04T22:18:39.011Z',
                    'transactions': [
                        {
                            'id': 'a8d18024-d165-4538-b584-84dabd2da56e',
                            'amount': 1200,
                            'description': 'Resgate Fondo de Investimento Premium',
                            'value': 400,
                            'quantity': 3,
                            'tradeDate': '2021-09-15T00:00:00.000Z',
                            'date': '2021-09-15T00:00:00.000Z',
                            'type': 'SELL',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'DEBIT'
                        },
                        {
                            'id': '42497701-6c3f-478b-ae5e-7d1ed2e5ee72',
                            'amount': 1200,
                            'description': 'Aplicação Fondo de Investimento Premium',
                            'value': 400,
                            'quantity': 3,
                            'tradeDate': '2021-09-01T00:00:00.000Z',
                            'date': '2021-09-01T00:00:00.000Z',
                            'type': 'BUY',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'CREDIT'
                        },
                        {
                            'id': '556bde70-79ec-4874-9572-ff5febbdcd65',
                            'amount': 1500,
                            'description': 'Aplicação Fondo de Investimento Premium',
                            'value': 500,
                            'quantity': 3,
                            'tradeDate': '2021-08-15T00:00:00.000Z',
                            'date': '2021-08-15T00:00:00.000Z',
                            'type': 'BUY',
                            'netAmount': null,
                            'brokerageNumber': null,
                            'expenses': null,
                            'movementType': 'CREDIT'
                        }
                    ]
                }
            ];

            setInvestmentsBalance(response.reduce((acc, item) => acc + item.balance, 0));
            setinvestimentsList(response);

            setLoadingInvestments(false);
        }, 2000);
    };

    return (
        <Page id={pageId} >
            <Loading id={'overview'} />

            <CookiesPolicyModal
                handle={handleIAgreeButton}
                handleClickOut={handleLearnMoreButton}
                showDialog={showCookiesDialog}
                text={t('cookies.messages.content')}
            />

            <MessagePopup
                level={popUpLevel}
                text={popUpText}
                duration={popUpDuration}
            />

            <ConnectAccountModal
                open={isConnectAccountModalVisible}
                onClose={() => {
                    setIsConnectAccountModalVisible(false);
                }}
                isLoading={false}

            />

            <Layout
                checkAuth={true}
                page={pageId}
                quickSettings='full'
                setIsUserAuthenticated={setIsUserAuthenticated}
                showToolbar={true}
                showHeader={true}
            >
                <Row
                    a='unset'
                    className='main-row'
                    fill='all'
                >
                    {/* First Column */}
                    <Column w='5' fill='all'>
                        <Panel id='balance' fit='height'>
                            <Title variation='tertiary' txt={t('balance.s')} />

                            <hr />

                            <Row j='between' fill='width'>
                                <p className='side-label'>Total</p>
                                <p className='balance-total'><b>R$ {currencyFormatter(totalBalance)}</b></p>
                            </Row>

                            <hr />

                            <Row j='between' fill='width'>
                                <p className='side-label' >Em Conta</p>
                                <p className='balance-subtotal'><b>R$ {currencyFormatter(bankBalance)}</b></p>
                            </Row>

                            <Row j='between' fill='width'>
                                <p className='side-label'>Crédito disponível</p>
                                <p className='balance-subtotal'><b>R$ {currencyFormatter(creditBalance)}</b></p>
                            </Row>

                            <Row j='between' fill='width'>
                                <p className='side-label'>Investimentos</p>
                                <p className='balance-subtotal'><b>R$ {currencyFormatter(investmentsBalance)}</b></p>
                            </Row>
                        </Panel>

                        <Panel
                            id='accounts'
                            fit='height'
                            j='between'
                        >
                            <Title variation='tertiary' txt={t('account.p')} />

                            <hr />

                            {!bankData
                                ? <p>Carregando...</p>
                                : <Column fill='width' className='account-card'>
                                    <p><b>{bankData?.marketingName}</b></p>

                                    <p className='side-label'>{bankData?.name}</p>

                                    <Row fill='width' j='between'>
                                        <p className='side-label'>Saldo</p>

                                        <p><b>R$ {currencyFormatter(bankData?.balance)}</b></p>
                                    </Row>
                                </Column>
                            }

                            <hr />

                            <Button
                                variation='secondary'
                                onClick={() => setIsConnectAccountModalVisible(true)}
                            >
                                {addIcon}
                                {t('add-account')}
                            </Button>
                        </Panel>

                        <Panel
                            id='credit-cards'
                            fit='height'
                            j='between'
                        >
                            <Title variation='tertiary' txt={t('cards.p')} />

                            <hr />

                            {!creditData
                                ? <p>Carregando...</p>
                                : <Column fill='width' className='account-card'>
                                    <p><b>{creditData?.marketingName}</b></p>

                                    <p className='side-label'>{creditData?.name}</p>

                                    <Row fill='width' j='between'>
                                        <p className='side-label'>Fechamento</p>

                                        <p><b>{creditData?.creditData?.balanceCloseDate}</b></p>
                                    </Row>

                                    <Row fill='width' j='between'>
                                        <p className='side-label'>Saldo</p>

                                        <p><b>R$ {currencyFormatter(creditData?.balance)}</b></p>
                                    </Row>

                                    <Row fill='width' j='between'>
                                        <p className='side-label'>Limite</p>

                                        <p><b>R$ {currencyFormatter(creditData?.creditData?.creditLimit)}</b></p>
                                    </Row>

                                    <Row fill='width' j='between'>
                                        <p className='side-label'>Pagamento mínimo</p>

                                        <p><b>R$ {currencyFormatter(creditData?.creditData?.minimumPayment)}</b></p>
                                    </Row>
                                </Column>
                            }

                            <hr />
                            <Button
                                variation='secondary'
                                onClick={() => { }}
                            >
                                {addIcon}
                                {t('add-credit-card')}
                            </Button>
                        </Panel>
                    </Column>

                    {/* Second Column */}
                    <Column w='14' fill='all'>
                        <Row id='top-panels'
                            fill='width'
                        >
                            <Panel id='revenue'
                                fill='width' fit='height'>
                                <Title variation='tertiary' txt={t('revenue.p')} />

                                <hr />

                                <Row fill='width' j='center'>
                                    <p>Sem items</p>
                                </Row>
                            </Panel>

                            <Panel id='expense'
                                fill='width' fit='height'>
                                <Title variation='tertiary' txt={t('expense.p')} />

                                <hr />

                                <Row fill='width' j='center'>
                                    <p>Sem items</p>
                                </Row>
                            </Panel>

                            <Panel id='received'
                                fill='width' fit='height'>
                                <Title variation='tertiary' txt={t('received.p')} />

                                <hr />

                                <Row fill='width' j='center'>
                                    <p>Sem items</p>
                                </Row>
                            </Panel>

                            <Panel id='paid'
                                fill='width' fit='height'>
                                <Title variation='tertiary' txt={t('paid.p')} />

                                <hr />

                                <Row fill='width' j='center'>
                                    <p>Sem items</p>
                                </Row>
                            </Panel>
                        </Row>

                        <Panel id='financial-insights'
                            fill='width' fit='height'
                        >
                            <Row fill='width' fit='height'>
                                {aiIcon}

                                <Column fill='width'>
                                    <Title variation='tertiary' txt={t('financial-insights')} />

                                    {loadingInsight
                                        ? <Skeleton height={'17px'} />
                                        : <p>{insight}</p>
                                    }
                                </Column>

                                <SwitchableIcon
                                    id='refresh-balances'
                                    onToggle={() => getInsight()}
                                    staticImage={(<RefreshSvg className={'icon-svg' + (loadingInsight ? ' spinning' : '')} />)}
                                />
                            </Row>
                        </Panel>

                        <Panel id='transactions' fill='width' fit='height'>
                            <Title variation='tertiary' txt={t('transaction.p')} />

                            <hr />

                            <Row fill='width' j='center'>
                                <p>Sem transações</p>
                            </Row>
                        </Panel>
                    </Column>

                    <Column w='5' fill='height'>
                        <Panel id='expenses-graph' fill='width' fit='height'>
                            <Title variation='tertiary' txt={t('expenses-graph')} />
                        </Panel>

                        <Panel id='investments' fill='all'>
                            <Title variation='tertiary' txt={t('investment.p')} />

                            <hr />

                            {investimentsList.length == 0 ?
                                <p>{t('no-investiments')}</p>
                                :
                                <Column fill='width'>
                                    {investimentsList.map((investiment, index) => (
                                        <Row key={index} fill='width' j='between' className='investiment-card'>
                                            <p><b>{investiment.name}</b></p>
                                            <p><b>R$ {currencyFormatter(investiment.balance)}</b></p>
                                        </Row>
                                    ))}
                                </Column>
                            }

                        </Panel>
                    </Column>
                </Row>
            </Layout>
        </Page >
    );
};

export default Overview;
