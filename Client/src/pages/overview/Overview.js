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
    Page, Panel, Title, Button, Input,
    SwitchableIcon
} from 'components/imports'; // Layout

import {
    getAgreedCookiesPolicy, getLanguage, getTheme,
    setAgreedCookiesPolicy
} from 'utils/cookies';

// PDF
import { cookiesPolicyDoc } from 'constants';

import { AddSvg, DeleteSvg } from 'icons/imports';

import { pluggyAccountsGet, insightMePost, pluggyInvestmentsGet, pluggyItemDelete } from 'apis/imports';

import { currencyFormatter, percentageFormatter } from 'utils/formatters';

import ConnectAccountModal from './components/ConnectAccountModal';
import PieChart from './components/PieChart';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { Bar, Line } from '@antv/g2plot';

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

    const [popUpDuration, setPopUpDuration] = useState(3000);
    const [popUpLevel, setPopUpLevel] = useState('warning');
    const [popUpText, setPopUpText] = useState('-');

    const [totalBalance, setTotalBalance] = useState(0);
    const [bankBalance, setBankBalance] = useState(0);
    const [creditBalance, setCreditBalance] = useState(0);
    const [investmentsBalance, setInvestmentsBalance] = useState(0);

    const [transactions, setTransactions] = useState([]);
    const [transactionsSearch, setTransactionsSearch] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const [bankData, setBankData] = useState([]);
    const [creditData, setCreditData] = useState([]);

    const [insight, setInsight] = useState('loading-insights');
    const [insightSources, setInsightSources] = useState([]);

    const [newConnection, setNewConnection] = useState(true);
    const [loadingAccounts, setLoadingAccounts] = useState(true);

    const [isConnectAccountModalVisible, setIsConnectAccountModalVisible] = useState(false);

    const [investmentsList, setinvestmentsList] = useState([]);
    const [loadingInvestments, setLoadingInvestments] = useState(true);

    const [totalIncomes, setTotalIncomes] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);

    const [incomesData, setIncomesData] = useState([]);
    const [expensesData, setExpensesData] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [transactionTypeData, setTransactionTypeData] = useState([]);

    const [showValues, setShowValues] = useState(true);

    const receivedCategories = ['transfers', 'mutual-funds'];

    const addIcon = <AddSvg
        className='icon-svg'
        style={{ color: (bankData.length === 0 && creditData.length === 0 ? 'white' : 'gray') }}
    />;

    const deleteIcon = <DeleteSvg
        className='icon-svg'
        style={{
            color: 'var(--indian-red',
            height: '1rem',
            width: '1rem'
        }}
    />;

    let barPlot = null;


    useEffect(() => {
        if (location.pathname === `/${pageId}`) {
            document.title = `${t('overview')} - Minhas Finanças`;

            setShowCookiesDialog(!getAgreedCookiesPolicy());
        }
    }, [location.pathname]);


    useEffect(() => {
        if (isUserAuthenticated && newConnection) {
            getAccounts();
            getInvestments();

            setNewConnection(false);
        }
    }, [isUserAuthenticated, newConnection]);


    useEffect(() => {
        document.body.classList.remove('bright', 'dark');
        document.body.classList.add(appTheme);
        i18n.changeLanguage(appLang);
    }, [appTheme, appLang]);


    useEffect(() => {
        setTotalBalance(creditBalance + bankBalance + investmentsBalance);
    }, [creditBalance, bankBalance, investmentsBalance]);


    useEffect(() => {
        const categoryExpenses = {};
        const transactionTypeExpenses = { debit: 0, credit: 0 };

        let totalExpenses = 0;

        transactions.forEach(transaction => {
            const { category, amount, type } = transaction;

            if (category) {
                categoryExpenses[category] = (categoryExpenses[category] || 0) + amount;
                totalExpenses += amount;
            }

            if (type) {
                transactionTypeExpenses[type] += amount;
            }
        });

        let incomesPerMonth = transactions
            .filter(transaction => receivedCategories.includes(transaction.category))
            .reduce((columns, transaction) => {
                const transactionDate = new Date(transaction.date);
                const month = transactionDate.getMonth() + 1;
                const year = transactionDate.getFullYear();
                const key = `${year}-${month.toString().padStart(2, '0')}`;

                const existingColumn = columns.find(column => column.month === key);
                if (existingColumn) {
                    existingColumn.total += transaction.amount;
                } else {
                    columns.push({ month: key, total: transaction.amount });
                }

                return columns;
            }, []);

        setTotalIncomes(incomesPerMonth.reduce((total, data) => total + data.total, 0));

        const allIncomeMonths = [];
        if (incomesPerMonth.length > 0) {
            const firstTransactionDate = new Date(
                Math.min(...transactions.map(t => new Date(t.date).getTime()))
            );
            const lastTransactionDate = new Date(
                Math.max(...transactions.map(t => new Date(t.date).getTime()))
            );

            const current = new Date(firstTransactionDate.getFullYear(), firstTransactionDate.getMonth(), 1);
            const end = new Date(lastTransactionDate.getFullYear(), lastTransactionDate.getMonth(), 1);

            while (current <= end) {
                const monthKey = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`;
                allIncomeMonths.push(monthKey);
                current.setMonth(current.getMonth() + 1);
            }

            incomesPerMonth = allIncomeMonths.map(monthKey => {
                const existingData = incomesPerMonth.find(data => data.month === monthKey);
                return {
                    month: monthKey,
                    total: existingData ? existingData.total : 0,
                };
            });
        }

        incomesPerMonth = incomesPerMonth.map(item => ({
            month: new Date(item.month.split('-')[0], item.month.split('-')[1] - 1, 1)
                .toLocaleString('default', { month: 'long', year: 'numeric' }),
            total: item.total,
        }));

        setIncomesData(incomesPerMonth);

        let expensesPerMonth = transactions
            .filter(transaction => !receivedCategories.includes(transaction.category))
            .reduce((columns, transaction) => {
                const transactionDate = new Date(transaction.date);
                const month = transactionDate.getMonth() + 1;
                const year = transactionDate.getFullYear();
                const key = `${year}-${month.toString().padStart(2, '0')}`;

                const existingColumn = columns.find(column => column.month === key);
                if (existingColumn) {
                    existingColumn.total += transaction.amount;
                } else {
                    columns.push({ month: key, total: transaction.amount });
                }

                return columns;
            }, []);

        setTotalExpenses(expensesPerMonth.reduce((total, data) => total + data.total, 0));

        const allExpensesMonths = [];
        if (expensesPerMonth.length > 0) {
            const firstTransactionDate = new Date(
                Math.min(...transactions.map(t => new Date(t.date).getTime()))
            );
            const lastTransactionDate = new Date(
                Math.max(...transactions.map(t => new Date(t.date).getTime()))
            );

            const current = new Date(firstTransactionDate.getFullYear(), firstTransactionDate.getMonth(), 1);
            const end = new Date(lastTransactionDate.getFullYear(), lastTransactionDate.getMonth(), 1);

            while (current <= end) {
                const monthKey = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`; // Garante o formato "YYYY-MM"
                allExpensesMonths.push(monthKey);
                current.setMonth(current.getMonth() + 1);
            }

            expensesPerMonth = allExpensesMonths.map(monthKey => {
                const existingData = expensesPerMonth.find(data => data.month === monthKey);
                return {
                    month: monthKey,
                    total: existingData ? existingData.total : 0, // Usa 0 se o mês não tiver dados
                };
            });
        }

        expensesPerMonth = expensesPerMonth.map(item => ({
            month: new Date(item.month.split('-')[0], item.month.split('-')[1] - 1, 1)
                .toLocaleString('default', { month: 'long', year: 'numeric' }), // Formata o nome do mês
            total: item.total,
        }));

        setExpensesData(expensesPerMonth);

        const categoryDataWithPercentage = Object.entries(categoryExpenses).map(([key, value]) => ({
            category: key,
            value,
            percentage: ((value / totalExpenses) * 100).toFixed(2),
        }));

        categoryDataWithPercentage.sort((a, b) => b.value - a.value);

        setCategoriesData(categoryDataWithPercentage);

        setTransactionTypeData(
            Object.entries(transactionTypeExpenses).map(([key, value]) => ({ type: key, value }))
        );

        setCategoriesData((prevData) => prevData.map((item) => ({ ...item, total: totalExpenses })));
    }, [transactions]);


    useEffect(() => {
        let unifiedLinePlot;

        if (unifiedLinePlot) {
            unifiedLinePlot.destroy();
        }

        const container = document.getElementById('income-expense-line-container');
        if (container) {
            container.innerHTML = '';
        }

        // Combine os dados de incomes e expenses em uma única estrutura
        const combinedData = [
            ...incomesData.map(item => ({ ...item, type: 'income.s' })), // Adicione um campo para diferenciar os dados
            ...expensesData.map(item => ({ ...item, type: 'expense.p' })),
        ];

        unifiedLinePlot = new Line('income-expense-line-container', {
            data: combinedData,
            xField: 'month',
            yField: 'total',
            seriesField: 'type',
            xAxis: {
                label: { formatter: (text) => t(text) }
            },
            yAxis: {
                label: { formatter: (value) => showValues ? currencyFormatter(value) : '--' },
                grid: null
            },
            tooltip: {
                fields: ['month', 'total', 'type'],
                formatter: ({ month, total, type }) => ({
                    name: t(type),
                    value: showValues ? currencyFormatter(total) : '--',
                })
            },
            smooth: true,
            point: {
                size: 3,
                shape: 'circle',
                style: {
                    stroke: '#fff',
                    lineWidth: 2,
                }
            },
            lineStyle: { lineWidth: 2 },
            color: ['#2C8C64', '#EB5353'],
            legend: {
                position: 'right',
                itemName: {
                    formatter: (text) => t(text)
                }
            },
            interactions: [{ type: 'active-region' }],
            autoFit: true
        });

        unifiedLinePlot.render();

        return () => {
            if (unifiedLinePlot) unifiedLinePlot.destroy();
        };
    }, [incomesData, expensesData, currencyFormatter, t, showValues]);


    useEffect(() => {
        if (barPlot) barPlot.destroy();

        $('#bar-container').html('');

        barPlot = new Bar('bar-container', {
            data: transactionTypeData,
            xField: 'value',
            yField: 'type',
            yAxis: { label: null },
            padding: [20, 170, 20, 20],
            forceFit: true,
            seriesField: 'type',
            legend: {
                position: 'right',
                itemName: { formatter: (category) => t(category) }
            },
            tooltip: {
                fields: ['type', 'value'],
                formatter: ({ type, value }) => ({
                    title: null,
                    name: t(type),
                    value: showValues ? currencyFormatter(value) : '--',
                }),
            },
            label: {
                position: 'right',
                content: ({ value }) => showValues ? currencyFormatter(value) : '--'
            },
            color: ['#1890ff', '#f04864']
        });

        barPlot.render();

    }, [transactionTypeData, showValues]);


    useEffect(() => {
        if (transactionsSearch === '')
            setFilteredTransactions(transactions);
        else
            setFilteredTransactions(transactions
                .filter(item => JSON
                    .stringify(item)
                    .toLowerCase()
                    .includes(transactionsSearch.toLowerCase()
                    )
                )
            );
    }, [transactions, transactionsSearch]);


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


    const getAccounts = async () => {

        if (!isUserAuthenticated) return;

        setLoadingAccounts(true);

        const { isSuccess, response } = await pluggyAccountsGet({});

        setLoadingAccounts(false);

        if (!isSuccess) {

            setPopUpLevel('error');
            setPopUpText(t('error-get-accounts'));
            setPopUpDuration(3500);

            return;
        }

        if (response.length === 0) {
            setInsight('no-insight');
            return;
        }

        let transactions = response.reduce((total, item) => {

            if (!item?.transactions) item.transactions = [];

            item.transactions = item.transactions.map((transaction) => {
                transaction.date = new Date(transaction.date);
                transaction.bankType = item.type;
                transaction.bankMarketingName = item.marketingName;
                transaction.category = transaction.category.toLowerCase().replaceAll(' ', '-');
                transaction.type = transaction.type.toLowerCase();
                return transaction;
            });

            return total.concat(item.transactions);
        }, []);

        transactions.sort((a, b) => b.date - a.date);

        setTransactions(transactions);

        let bankData = response.filter((item) => item.type == 'BANK');
        let creditData = response.filter((item) => item.type == 'CREDIT');

        setBankData(bankData);
        setCreditData(creditData);

        setBankBalance(bankData.reduce((total, item) => total + item.bankData.closingBalance, 0));
        setCreditBalance(creditData.reduce((total, item) => total + item.creditData.availableCreditLimit, 0));


        insightMePost({ message: JSON.stringify(transactions) }).then((result) => {
            setInsight(result.response.insight);
            setInsightSources(result.response.sources);
        });
    };


    const getInvestments = async () => {

        if (!isUserAuthenticated) return;

        setLoadingInvestments(true);

        const { isSuccess, response } = await pluggyInvestmentsGet();

        if (!isSuccess) {

            setPopUpLevel('error');
            setPopUpText(t('error-get-investments'));

            return;
        }

        setInvestmentsBalance(response.reduce((acc, item) => acc + item.balance, 0));
        setinvestmentsList(response);

        setLoadingInvestments(false);
    };


    const handleDeleteAccount = async (itemId) => {

        if (!isUserAuthenticated) return;

        // Browser dialog
        if (window.confirm(t('confirm-delete-account'))) {

            const { isSuccess } = await pluggyItemDelete({ itemId });

            if (isSuccess) window.location.reload();
        }
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
                setNewConnection={setNewConnection}
            />

            <Layout
                checkAuth={true}
                page={pageId}
                quickSettings='full'
                setIsUserAuthenticated={setIsUserAuthenticated}
                showToolbar={true}
                showHeader={true}
                insight={insight}
                insightSources={insightSources}
                showInsight={true}
                showValues={showValues}
                setShowValues={setShowValues}
            >
                <Row
                    a='unset'
                    className='main-row'
                    fill='all'
                >
                    <Column
                        id='first-column'
                        w='6'
                    >
                        <Panel id='balance'
                            fit='height'
                            g='0'
                        >
                            <Row j='between' fill='width'>
                                <Title variation='tertiary' txt={t('general-total')} />

                                <p className='balance-total'><b>{showValues ? currencyFormatter(totalBalance) : '--'}</b></p>
                            </Row>

                            <hr />

                            <Button
                                variation={bankData.length === 0 && creditData.length === 0 ? 'primary' : 'secondary'}
                                onClick={() => setIsConnectAccountModalVisible(true)}
                            >
                                {addIcon}
                                {t('add-account')}
                            </Button>
                        </Panel>

                        <Panel
                            id='accounts'
                            j='between'
                            fill='all'
                            g='0'
                        >
                            <Row j='between' fill='width'>
                                <Title variation='tertiary' txt={t('account.p')} />

                                <Row>
                                    <p className='side-label'>{t('total')}
                                    </p>

                                    <p className='balance-subtotal'><b>{showValues ? currencyFormatter(bankBalance) : '--'}</b></p>
                                </Row>
                            </Row>

                            <hr />

                            {loadingAccounts ?
                                <Column fill='all'>
                                    <Skeleton
                                        count={2}
                                        height={80}
                                        width={'100%'}
                                        style={{ marginBottom: 10 }}
                                    />
                                </Column>
                                : bankData.length === 0
                                    ? <Column a='center' fill='all' j='center'>
                                        <p className='side-label'>{t('no-accounts')}</p>
                                    </Column>
                                    : <Column
                                        fill='all'
                                        scroll
                                    >
                                        {bankData.map(bankData => (
                                            <Row
                                                className='account-card'
                                                fill='width'
                                                j='between'
                                                a='start'
                                                key={bankData?.id}
                                            >
                                                <Column fill='width'>
                                                    <p className='side-label-small'>{bankData?.name}</p>

                                                    <p><b>{bankData?.marketingName}</b></p>

                                                    <p className='side-label'>{bankData?.number}</p>
                                                </Column>

                                                <Column a='end' fill='width'>
                                                    <SwitchableIcon
                                                        staticImage={deleteIcon}
                                                        onToggle={() => handleDeleteAccount(bankData?.itemId)}
                                                    />

                                                    <p className='balance-subtotal'><b>{showValues ? currencyFormatter(bankData?.balance) : '--'}</b></p>

                                                    <p className='side-label-small'>
                                                        {t('last-update')} &nbsp;
                                                        {new Date(bankData?.updatedAt).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </Column>
                                            </Row>
                                        ))}
                                    </Column>
                            }
                        </Panel>

                        <Panel
                            id='credit-cards'
                            j='between'
                            fill='all'
                            g='0'
                        >
                            <Row j='between' fill='width'>
                                <Title variation='tertiary' txt={t('cards.p')} />

                                <Row>
                                    <p className='side-label'>{t('total-available')}</p>

                                    <p className='balance-subtotal'><b>{showValues ? currencyFormatter(creditBalance) : '--'}</b></p>
                                </Row>
                            </Row>

                            <hr />

                            {loadingAccounts
                                ? <Column fill='all'>
                                    <Skeleton
                                        count={2}
                                        height={80}
                                        width={'100%'}
                                        style={{ marginBottom: 10 }}
                                    />
                                </Column>
                                : creditData.length === 0
                                    ? <Column a='center' fill='all' j='center'>
                                        <p className='side-label'>{t('no-credit-cards')}</p>
                                    </Column>
                                    : <Column
                                        fill='all'
                                        scroll
                                    >
                                        {!creditData
                                            ? <></>
                                            : creditData.map(creditData => (
                                                <Column
                                                    fill='width'
                                                    className='account-card'
                                                    key={creditData?.id}
                                                >
                                                    <Row fill='width' j='between'>
                                                        <p className='side-label'>{creditData?.name}</p>

                                                        <p className='side-label-small'>
                                                            {t('last-update')} &nbsp;
                                                            {new Date(creditData?.updatedAt).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </Row>

                                                    <p><b>{creditData?.marketingName}</b></p>

                                                    <Row fill='width' j='between'>
                                                        <p className='side-label'>{t('closing')}</p>

                                                        <p><b>{new Date(creditData?.creditData?.balanceCloseDate).toLocaleDateString('pt-BR')}</b></p>
                                                    </Row>

                                                    <Row fill='width' j='between'>
                                                        <p className='side-label'>{t('available')}</p>

                                                        <p className='trend-up-text'><b>{showValues ? currencyFormatter(creditData?.creditData?.availableCreditLimit) : '--'}</b></p>
                                                    </Row>

                                                    <Row fill='width' j='between'>
                                                        <p className='side-label'>{t('used')}</p>

                                                        <p className='trend-down-text'><b>{showValues ? currencyFormatter(creditData?.balance) : '--'}</b></p>
                                                    </Row>

                                                    <Row fill='width' j='between'>
                                                        <p className='side-label'>{t('limit')}</p>

                                                        <p><b>{showValues ? currencyFormatter(creditData?.creditData?.creditLimit) : '--'}</b></p>
                                                    </Row>
                                                </Column>
                                            ))
                                        }
                                    </Column>
                            }
                        </Panel>
                    </Column>

                    <Column w='12' fill='all'>
                        <Panel id='incomes-vs-expenses'
                            fill='width'
                            fit='height'
                            g='0'
                        >
                            <Row fill='width' j='between'>
                                <Row fill='width'>
                                    <Title variation='tertiary' txt={t('incomes-vs-expenses')} />
                                </Row>

                                <Row fill='width' j='between'>
                                    <Row>
                                        <p className='side-label'>{t('total-incomes')}</p>

                                        <p className='balance-subtotal trend-up-text'><b>{showValues ? currencyFormatter(totalIncomes) : '--'}</b></p>
                                    </Row>

                                    <Row>
                                        <p className='side-label'>{t('total-expenses')}</p>

                                        <p className='balance-subtotal trend-down-text'><b>{showValues ? currencyFormatter(totalExpenses) : '--'}</b></p>
                                    </Row>
                                </Row>
                            </Row>

                            <hr />

                            {loadingAccounts
                                ?
                                <Skeleton
                                    height={100}
                                    width={'100%'}
                                />
                                : incomesData.length === 0 && expensesData.length === 0 &&
                                <Column
                                    a='center'
                                    fill='all'
                                    j='center'
                                    style={{ height: 100 }}
                                >
                                    <p className='side-label'>{t('connect-to-show')}</p>
                                </Column>
                            }

                            <div id='income-expense-line-container' style={{
                                height: 100,
                                display: (incomesData.length === 0 && expensesData.length === 0 ? 'none' : 'block')
                            }} />
                        </Panel>

                        <Panel id='transactions'
                            fill='all'
                            g='0'
                        >
                            <Row fill='width' j='between'>
                                <Row w='16'>
                                    <Title variation='tertiary' txt={t('transaction.p')} />
                                </Row>

                                <Row w='8'>
                                    <Input
                                        placeholder={t('search')}
                                        value={transactionsSearch}
                                        onChange={e => setTransactionsSearch(e.target.value)}
                                    />
                                </Row>
                            </Row>

                            <hr />

                            {loadingAccounts
                                ? <Skeleton
                                    count={5}
                                    height={50}
                                    width={'100%'}
                                    style={{ marginBottom: 10 }}
                                />
                                : filteredTransactions.length === 0
                                    ? <Column a='center' fill='all' j='center'>
                                        <p className='side-label'>{t('no-transactions')}</p>
                                    </Column>
                                    : <>
                                        <Row
                                            className='transactions-list'
                                            fill='width'
                                            j='between'
                                        >
                                            <p className='col-0'><b>Data</b></p>

                                            <p className='col-1'><b>Descrição</b></p>

                                            <p className='col-2'><b>Valor</b></p>

                                            <p className='col-3'><b>Categoria</b></p>

                                            <p className='col-4'><b>Tipo</b></p>

                                            <p className='col-5'><b>Identificador</b></p>
                                        </Row>

                                        <Column
                                            className='transactions-list'
                                            fill='all'
                                            scroll
                                            g='0'
                                        >
                                            {
                                                filteredTransactions.map((transaction, index) => (
                                                    <>
                                                        <hr />

                                                        <Row
                                                            key={index}
                                                            fill='width'
                                                            j='between'
                                                            className='transaction-item'
                                                        >
                                                            <p className='col-0'>{transaction.date.toLocaleDateString('pt-BR')}</p>

                                                            <p className='col-1'>{transaction.description}</p>

                                                            <p className={'col-2 ' + (receivedCategories.includes(transaction.category) ? 'trend-up-text' : 'trend-down-text')}><b>{showValues ? currencyFormatter(transaction.amount) : '--'}</b></p>

                                                            <p className='col-3'>{t(transaction.category)}</p>

                                                            <p className='col-4'>{t(transaction.type)}</p>

                                                            <p className='col-5'>{transaction.bankMarketingName}</p>
                                                        </Row>
                                                    </>
                                                ))
                                            }
                                        </Column>
                                    </>
                            }
                        </Panel>
                    </Column>

                    <Column w='6' fill='height'>
                        <Panel id='expenses-graph'
                            fill='width'
                            fit='height'
                            g='0'
                        >
                            <Title variation='tertiary' txt={t('expenses-graph')} />

                            <hr />

                            {loadingAccounts
                                ? <Column fill='all'>
                                    <Skeleton
                                        height={200}
                                        width={'100%'}
                                    />
                                </Column>
                                : categoriesData.length === 0
                                    ? <Column
                                        a='center'
                                        fill='all'
                                        j='center'
                                        style={{ height: 200 }}
                                    >
                                        <p className='side-label'>{t('connect-to-show')}</p>
                                    </Column>
                                    : <PieChart
                                        data={categoriesData}
                                        showValues={showValues}
                                        currencyFormatter={currencyFormatter}
                                        t={t}
                                    />
                            }

                            <hr />

                            <div id="bar-container" style={{
                                height: 75,
                                display: (transactionTypeData.length === 0 ? 'none' : 'block')
                            }} />
                        </Panel>

                        <Panel id='investments'
                            fill='all'
                            g='0'
                        >
                            <Row j='between' fill='width'>
                                <Title variation='tertiary' txt={t('investment.p')} />

                                <Row>
                                    <p className='side-label'>{t('total')}</p>

                                    <p className='balance-subtotal'><b>{showValues ? currencyFormatter(investmentsBalance) : '--'}</b></p>
                                </Row>
                            </Row>

                            <hr />

                            {loadingInvestments
                                ? <Column fill='all'>
                                    <Skeleton
                                        count={3}
                                        height={50}
                                        width={'100%'}
                                        style={{ marginBottom: 10 }}
                                    />
                                </Column>
                                : investmentsList.length == 0
                                    ? <Column
                                        a='center'
                                        fill='all'
                                        j='center'
                                    >
                                        <p className='side-label'>{t('no-investments')}</p>
                                    </Column>
                                    :
                                    <Column fill='all' scroll>
                                        {investmentsList.map((investiment, index) => (
                                            <Row
                                                className='investiment-card'
                                                key={index}
                                                fill='width'
                                                j='between'
                                            >
                                                <Column>
                                                    <p><b>{investiment.name}</b></p>

                                                    <p className='side-label'>{t(investiment.type.toLowerCase().replaceAll('_', '-'))}</p>
                                                </Column>

                                                <Column a='end'>
                                                    <p><b>{showValues ? currencyFormatter(investiment.balance) : '--'}</b></p>

                                                    <Row>
                                                        <p className='side-label'>{t('annual-rate')}</p>

                                                        <p className='trend-up-text'><b>{showValues ? percentageFormatter({ v: investiment.fixedAnnualRate ?? investiment.annualRate, multiply: false }) : '--%'}</b></p>
                                                    </Row>
                                                </Column>
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
