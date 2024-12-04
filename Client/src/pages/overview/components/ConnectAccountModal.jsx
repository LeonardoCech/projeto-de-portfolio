/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { useTranslation } from 'react-i18next';

// Ant Design Components
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

// Custom Components
import { Button, Column, Input, Row, Title } from 'components/imports';
import { Select } from 'antd';

import { pluggyConnectorsGet } from 'apis/imports';


const ConnectAccountModal = ({ open, onClose }) => {

    const { t } = useTranslation();

    const [availableConnectorsList, setAvailableConnectorsList] = useState([]);

    const [selectedConnector, setSelectedConnector] = useState({});

    const [confirmButtonState, setConfirmButtonState] = useState('disabled');

    const [credentialsValues, setCredentialsValues] = useState({});

    useEffect(() => {
        getConnectors();
    }, []);

    useEffect(() => {
        let invalidValues = Object.values(credentialsValues).filter(credentialsValue => credentialsValue.invalid);

        if (Object.keys(credentialsValues).length > 0 &&
            invalidValues.length === 0) {
            setConfirmButtonState('enabled');
            return;
        }
        setConfirmButtonState('disabled');

    }, [credentialsValues]);


    const getConnectors = async () => {
        const result = await pluggyConnectorsGet();

        if (result.isSuccess)
            setAvailableConnectorsList(result.response.connectors);
    };


    const changeSelectedConnector = (newSelectedConnectorId) => {

        const connector = availableConnectorsList.find(connector => connector.id === newSelectedConnectorId);

        setSelectedConnector(connector);
    };


    const clearForm = () => {
        setConfirmButtonState('disabled');
    };


    const handleConfirm = async (event) => {
        event.preventDefault();

        setConfirmButtonState('loading');

        // try {
        //     const props = {
        //         exchangeSlug: selectedExchange,
        //         apiKey: apiKey,
        //         secret: secret
        //     };

        //     if (exchangesPasswordRequired.includes(selectedExchange))
        //         props.password = password;

        //     const result = await exchangesConnectionsMePost(props);

        //     if (result.isSuccess) {
        //         await fetchExchanges();

        //         setConfirmButtonState('success');
        //         setPopUpText(t('sucess-exchange-connect'));
        //         setPopUpLevel('success');
        //         setPopUpDuration(3000);

        //         onClose();

        //     } else {
        //         setConfirmButtonState('error');
        //         setPopUpLevel('error');
        //         setPopUpDuration(3000);

        //         if (result.status === 403) {
        //             setPopUpText(t('error-exchange-connect'));
        //         }
        //         else {
        //             setPopUpText(t(`api_codes.default.${result.status}_0`));
        //         }

        //     }
        // } catch (error) {
        //     setPopUpText(t('unexpected-error'));
        //     setPopUpLevel('error');
        //     setPopUpDuration(3000);
        // } finally {
        //     clearForm();
        // }
    };


    const handleCancel = () => {
        clearForm();
        onClose();
    };


    const buildConnectorsFilter = () => {
        return availableConnectorsList.map(connector => ({
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={connector.imageUrl || ''}
                        alt={connector.name}
                        style={{
                            width: 32,
                            height: 32,
                            marginRight: 16,
                            borderRadius: 100,
                            backgroundColor: 'var(--anti-flash-white)'
                        }}
                    />
                    {connector.name}
                </div>
            ),
            value: connector.id
        }));
    };

    const handleCredentialsInputChange = (event, validation) => {
        event.preventDefault();

        const { name, value } = event.target;
        let invalid = false;

        if (validation) {
            // Validação de expressão regular
            const validationRegex = new RegExp(validation);

            if (!validationRegex.test(value)) {
                $(`input[name=${name}]`).addClass('required');
                invalid = true;
            }
            else {
                $(`input[name=${name}]`).removeClass('required');
                invalid = false;
            }
        }

        setCredentialsValues({ ...credentialsValues, [name]: { value, invalid } });
    };


    return (
        <Modal
            title={<Title variation='secondary' txt={t('add-account')} />}
            open={open}
            onCancel={handleCancel}
            footer={null}
            closeIcon={<CloseOutlined />}
            centered
        >
            <hr />

            <form name='add-connector' onSubmit={handleConfirm}>
                <Column g='1'>
                    <Select
                        id='add-account-select-connector'
                        onChange={changeSelectedConnector}
                        options={buildConnectorsFilter()}
                        default={selectedConnector?.id}
                        variant='borderless'
                        placeholder={t('select-connector')}
                        optionLabelProp='label'
                    />

                    {selectedConnector?.credentials &&
                        selectedConnector.credentials.map((credential, index) => (
                            <Column key={index}>
                                <p><b>{credential.label}</b></p>

                                <Input
                                    key={index}
                                    id={`add-account-credential-${index}`}
                                    onChange={(e) => handleCredentialsInputChange(e, credential.validation)}
                                    placeholder={credential.placeholder}
                                    variation={credential.type}
                                    name={credential.name}
                                    value={credentialsValues?.[credential.name]?.value || ''}
                                />
                                {credentialsValues?.[credential.name]?.invalid &&
                                    <p key={index} style={{ color: 'var(--indian-red)' }}>
                                        {credential.validationMessage}
                                    </p >
                                }
                            </Column>
                        ))
                    }
                </Column>

                <hr />

                <Row
                    fill='width'
                    j='end'
                >
                    <Button id='add-exchange-connection-confirm-button'
                        state={confirmButtonState}
                        type='submit'
                    >{t('add')}</Button>
                </Row>
            </form>
        </Modal >
    );
};

export default ConnectAccountModal;
