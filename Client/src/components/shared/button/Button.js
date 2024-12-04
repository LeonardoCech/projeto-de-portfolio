import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { ConfirmImg, CloseImg, LoadingImg } from 'icons/imports';

import './Button.css';


const Button = (props) => {

    const [showIcon, setShowIcon] = useState(true);

    const className = props.className ? ' ' + props.className : '';
    const id = props.id ? props.id : '';
    const name = props.name ? props.name : '';
    const onClick = props.onClick || (() => { });
    const state = props.state ? props.state : 'enabled';
    const type = props.type ? props.type : 'button';
    const variation = props.variation ? props.variation : 'primary';

    var disabled = props.disabled || props.state == 'disabled' ? true : false;
    var icon = null;


    useEffect(() => {
        if (state === 'success' || state === 'error') {
            setShowIcon(true);
            const timer = setTimeout(() => {
                setShowIcon(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [state]);


    switch (state) {
        case 'enabled':
            disabled = false;
            break;
        case 'loading':
            icon = <img className='spinning' src={LoadingImg} />;
            disabled = true;
            break;
        case 'success':
            if (showIcon) {
                icon = <img src={ConfirmImg} />;
                disabled = true;
            }
            else disabled = false;
            break;
        case 'error':
            if (showIcon) {
                icon = <img src={CloseImg} />;
                disabled = true;
            }
            else disabled = false;
            break;
    }


    return (
        <button
            className={`button ${className} ${variation} ${state}`}
            disabled={disabled}
            name={name}
            id={id}
            onClick={onClick}
            type={type}
        >
            {props.children}
            {icon}
        </button>
    );
};


Button.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func,
    state: PropTypes.string,
    type: PropTypes.string,
    variation: PropTypes.string,
};


export default Button;