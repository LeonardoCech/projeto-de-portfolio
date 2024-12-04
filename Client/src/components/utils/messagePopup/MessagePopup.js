import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { CloseSvg, ConfirmSvg, InfoSvg, WarningSvg } from 'icons/imports';

import './MessagePopup.css';

import { Column, Panel, Row } from 'components/imports';

const MessagePopup = (props) => {
    
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        const { level, text, duration } = props;

        const newMessage = {
            id: Date.now(), // Identificador único baseado no timestamp atual
            level,
            text,
            duration,
            keepOpen: duration > 0
        };

        // Verifica se a nova mensagem é única
        const isUnique = !messages.some(message => message.text === newMessage.text && message.level === newMessage.level);

        const txt = newMessage.text.trim();

        if (isUnique && txt !== '' && txt !== '-') {
            // Adiciona a nova mensagem à pilha e inicia seu timer
            setMessages(prevMessages => [...prevMessages, newMessage]);

            if (newMessage.duration >= 0) {
                setTimeout(() => {
                    // Remove a mensagem da pilha após o tempo especificado
                    setMessages(prevMessages => prevMessages.filter(message => message.id !== newMessage.id));
                }, newMessage.duration);
            }
        }
    }, [props.level, props.text, props.duration]);

    const closeMessage = (id) => {
        setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
    };

    const renderIcon = (level) => {
        switch (level) {
            case 'error':
                return <CloseSvg alt='Error icon' />;
            case 'info':
                return <InfoSvg alt='Info icon' />;
            case 'success':
                return <ConfirmSvg alt='Success icon' />;
            case 'warning':
                return <WarningSvg alt='Warning icon' />;
            default:
                return null;
        }
    };

    return (
        <Column
            id="message-popup-column"
            m="0" p="0">
            {messages.map((message, index) => {

                let len = messages.length;

                return (
                    <Panel
                        className={'message-popup-container ' + message.level}
                        fit='height'
                        id={'message-popup-' + message.id}
                        key={message.id}

                        style={{ opacity: 1 - ((len - (index + 1)) * .2) }}
                    >
                        <Row fill='width' className='message-popup' j='between'>
                            <span className='icon'>{renderIcon(message.level)}</span>
                            <Row fill='width' j='start'>
                                <p>{message.text}</p>
                            </Row>
                            <CloseSvg alt='Close popup' id='close-popup' onClick={() => closeMessage(message.id)} />
                        </Row>
                        {
                            message.keepOpen ?
                                <span id='time-to-close-bar' style={{ animation: `barAnimation ${message.duration}ms linear` }}></span>
                                : <></>
                        }
                    </Panel>
                );
            })}
        </Column>
    );
};


MessagePopup.propTypes = {
    level: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired
};


export default MessagePopup;
