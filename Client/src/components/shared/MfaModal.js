import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Column, Input, Link, Row, Title } from 'components/imports';

import { Modal } from 'antd';


const MfaModal = (props) => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [mfaCode, setMfaCode] = useState(Array(6).fill(''));

    return (
        <Modal
            centered
            footer={null}
            closeIcon={null}
            open={props.isOpen}
            width={400}
        >
            <Column
                fill='all'
                g='1'
            >
                <Row>
                    <Link onClick={() => navigate('/sign-in')}>{t('change-account')}</Link>
                </Row>

                <Row
                    fill='width'
                    j='center'
                >
                    <Title
                        txt={t('do-captcha')}
                        variation='secondary'
                    />
                </Row>

                <hr />

                <form id='insert-code-form'>
                    <Column fill='width'>
                        <p id='verification-message'>{t('validate-auth-smartphone-code').replace('{username}', props.username)}</p>
                    </Column>

                    <Row
                        m='sec-ver'
                        fill='width'
                    >
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
                            onClick={() => {
                                props.handleSubmit(mfaCode.join(''));
                            }}
                            state={props.verifyButtonState}
                            type='submit'
                        >{t('verify.v')}</Button>
                    </Row>
                </form>
            </Column>
        </Modal >
    );
};


MfaModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    verifyButtonState: PropTypes.string.isRequired
};


export default MfaModal;
