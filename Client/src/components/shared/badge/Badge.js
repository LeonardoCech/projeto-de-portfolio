import React from 'react';
import PropTypes from 'prop-types';

import './Badge.css';


const Badge = (props) => {

    const variation = props.variation ? ' ' + props.variation : '';

    return (
        <div className={props.className + ' badge ' + (props.fill ? 'fill' : 'fit') + '-width' + variation}>
            {props.children}
        </div>
    );
};


Badge.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    variation: PropTypes.string,
    fill: PropTypes.bool
};


export default Badge;
