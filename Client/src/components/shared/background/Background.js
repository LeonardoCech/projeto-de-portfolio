import React from 'react';
import PropTypes from 'prop-types';

import './Background.css';


const Background = (props) => {

    const className = (props.className ? ' ' + props.className : '');
    const onClick = props.onClick || (() => { });

    return (
        <div
            className={'background' + className}
            id={props.id}
            onClick={onClick}
        >
            {props.children}
        </div>
    );
};


Background.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    onClick: PropTypes.func
};


export default Background;
