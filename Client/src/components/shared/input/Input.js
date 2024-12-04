import React, { useState } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { useTranslation } from 'react-i18next';

import { Row } from 'components/imports';
import { SwitchableIcon, Link } from 'components/imports';
import { InfoSvg, ShowSvg, HideSvg } from 'icons/imports';

import './Input.css';


const Input = (props) => {

    const { t } = useTranslation();

    const action = props.action ? props.action : null;
    const className = props.className ? ' ' + props.className : ' ';
    const code = props.code ? props.code : Array(6).fill('');
    const disabled = props.disabled ? props.disabled : false;
    const id = props.id ?? '';
    const infoText = props.infoText ? t(props.infoText) : '';
    const name = props.name ?? '';
    const onChange = props.onChange ? props.onChange : () => { };
    const setCode = props.setCode ? props.setCode : () => { };
    const placeholder = props.placeholder ? t(props.placeholder) : '';
    const variation = props.variation ? props.variation : 'text';
    const value = props.value ? props.value : '';


    const [showInfo, setShowInfo] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    var infoSvg = <InfoSvg className='icon-svg' />;


    const handleMfaCodeChange = (value, index) => {

        const newCode = [...code];
        newCode[index] = value.slice(0, 1);
        setCode(newCode);

        // Move to next input if the value is filled and not on the last input
        if (index < 5) {
            const $nextSibling = $(`input[name=digit-${index + 1}]`);
            if ($nextSibling !== null) $nextSibling.focus();
        }
    };


    const handleMfaCodeKeyUp = (e, index) => {
        const newCode = [...code];
        newCode[index - 1] = '';

        if (e.key === 'Backspace' && !code[index] && index > 0) {
            // Move to previous input if backspace is pressed and the input is empty
            const $prevSibling = $(`input[name=digit-${index - 1}]`);
            if ($prevSibling !== null) {
                setCode(newCode);
                $prevSibling.focus();
            }
        }

        // Handle ArrowLeft and ArrowRight key presses to move focus
        if (e.key === 'ArrowLeft' && index > 0) {
            const $prevSibling = $(`input[name=digit-${index - 1}]`);
            if ($prevSibling !== null) {
                $prevSibling.focus();
            }
        } else if (e.key === 'ArrowRight' && index < 5) {
            const $nextSibling = $(`input[name=digit-${index + 1}]`);
            if ($nextSibling !== null) {
                $nextSibling.focus();
            }
        }
    };


    switch (variation) {
        case 'email':
            if (infoText === '') {
                return (
                    <Row className={variation + className} fill='width'>
                        <input
                            className={'fill-width' + className}
                            id={id}
                            name={name}
                            onChange={onChange}
                            placeholder={placeholder}
                            type='email'
                            value={value}
                        />
                        {action && action['text'] ?
                            <Link className='input-action'
                                onClick={action['onClick']}>{action['text']}</Link> :
                            null}
                    </Row>
                );
            }
            else {
                return (
                    <Row className={variation + className} fill='width'>
                        <input
                            className={'fill-width' + className}
                            id={id}
                            name={name}
                            onChange={onChange}
                            placeholder={placeholder}
                            type='email'
                            value={value}
                        />
                        <span className='show-icon' onClick={() => setShowInfo(!showInfo)}>
                            <SwitchableIcon
                                staticImage={infoSvg}
                                title={showPassword ? t('password.show') : t('password.hide')}
                                isOn={showPassword}
                            />
                        </span>
                        <p className='container info-text' hidden={!showInfo}>{infoText}</p>
                    </Row>
                );
            }
        case 'mfa-code':
            $('input.unit').bind('paste', (event) => {
                // get ctrl v content
                const text = (event.originalEvent || event).clipboardData.getData('text/plain');

                // check if text is a 6-digit code
                if (text.length === 6 && !isNaN(text))
                    setCode(text.split(''));
            });

            return (
                <Row className={variation + className} fill='width' id={id} j={'between'}>
                    {
                        code.map((digit, index) => (
                            <input
                                autoComplete='off'
                                className={'input-blue-focus unit'}
                                id={id + ' digit-' + index}
                                key={index}
                                maxLength='1'
                                name={`digit-${index}`}
                                onChange={(e) => handleMfaCodeChange(e.target.value, index)}
                                onKeyUp={(e) => handleMfaCodeKeyUp(e, index)}
                                type='number'
                                value={digit}
                            />
                        ))
                    }

                    <input
                        autoComplete='off'
                        hidden
                        id={id + '-result'}
                        name={name}
                        onChange={(e) => onChange(e.target.value)}
                        value={code.join('')}
                    />
                </Row>
            );
        case 'number':
            return (
                <Row fill='width'>
                    <input
                        className={'fill-width ' + className}
                        onChange={onChange}
                        placeholder={placeholder}
                        id={id}
                        name={name}
                        type='number'
                        value={value}
                    />
                </Row>
            );
        case 'password':
            var showPwIcon = <ShowSvg className='icon-svg' />;
            var hidePwIcon = <HideSvg className='icon-svg' />;

            return (
                <Row className={variation + className} fill='width'>
                    <input
                        autoComplete='password'
                        className={'fill-width' + className}
                        id={id}
                        name={name}
                        onChange={onChange}
                        placeholder={t(placeholder)}
                        type={showPassword ? 'text' : 'password'}
                        value={value}
                    />
                    <span className='show-icon' onClick={() => setShowPassword(!showPassword)}>
                        <SwitchableIcon
                            onImage={hidePwIcon}
                            onToggle={() => { }}
                            offImage={showPwIcon}
                            title={showPassword ? t('password.show') : t('password.hide')}
                            isOn={showPassword}
                        />
                    </span>
                </Row>
            );
        case 'tel':
            return (
                <Row className={variation + className} fill='width'>
                    <input
                        className={'fill-width ' + variation + className}
                        disabled={disabled}
                        id={id}
                        name={name}
                        onChange={onChange}
                        placeholder={placeholder}
                        type='tel'
                        value={value}
                    />
                    <Link
                        className='input-action'
                        onClick={() => { }}
                    >
                        {t('send code')}
                    </Link>
                </Row>
            );
        case 'searchbar':
            return (
                <Row fill='width'>
                    <input
                        className={'fill-width ' + variation + className}
                        disabled={disabled}
                        id={id}
                        name={name}
                        onChange={onChange}
                        placeholder={placeholder}
                        type='text'
                        value={value}
                    />
                </Row>
            );
        case 'text':
            return (
                <Row fill='width'>
                    <input
                        autoComplete={variation === 'email' ? 'username' : 'off'}
                        className={'fill-width ' + className}
                        onChange={onChange}
                        placeholder={placeholder}
                        id={id}
                        name={name}
                        type='text'
                        value={value}
                    />
                </Row>
            );
        case 'text-minimal':
            return (
                <input
                    autoComplete={variation === 'email' ? 'username' : 'off'}
                    className={'fill-width ' + variation + className}
                    onChange={onChange}
                    placeholder={placeholder}
                    id={id}
                    name={name}
                    type='text'
                    value={value}
                />
            );
    }
};


Input.propTypes = {
    action: PropTypes.object,
    className: PropTypes.string,
    code: PropTypes.array,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    infoText: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    setCode: PropTypes.func,
    variation: PropTypes.string,
    value: PropTypes.string
};


export default Input;
