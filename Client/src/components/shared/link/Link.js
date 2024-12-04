import React from 'react';
import PropTypes from 'prop-types';

import './Link.css';


const Link = (props) => {

    const className = props.className ? ' ' + props.className : '';
    const disabled = props.disabled ? ' disabled' : '';
    const onClick = props.onClick || (() => { });
    const target = props.target ? props.target : '_blank';
    const variation = props.variation ? ' ' + props.variation : ' primary';

    return (
        <a
            className={'link' + className + disabled + variation}
            href={disabled ? '#' : props.href}
            id={props.id}
            onClick={disabled ? () => { } : onClick}
            rel="noreferrer"
            target={target}
        >
            {props.children}
        </a>
    );
};


Link.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    id: PropTypes.string,
    onClick: PropTypes.func,
    target: PropTypes.string,
    variation: PropTypes.string
};


export default Link;
