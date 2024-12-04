import React from 'react';
import PropTypes from 'prop-types';

import './Header.css';


const Header = (props) => {

    const variation = props.variation ? ' ' + props.variation : '';

    return (
        <div className={'header' + variation}>
            { props.children }
        </div>
    );
};


Header.propTypes = {
    children: PropTypes.node,
    variation: PropTypes.string.isRequired,
};


export default Header;
