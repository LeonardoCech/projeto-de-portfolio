import React from 'react';
import PropTypes from 'prop-types';

import './Page.css';

const Page = ({ id, children, backgroundImage, className }) => {
    const pageStyle = backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    } : {};

    return (
        <div 
            className={`page ${className}`} 
            id={id} 
            style={pageStyle}
        >
            {children}
        </div>
    );
};

Page.propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired,
    backgroundImage: PropTypes.string,
    className: PropTypes.string
};

Page.defaultProps = {
    backgroundImage: null
};

export default Page;