import React from 'react';
import PropTypes from 'prop-types';

import './Content.css';



const Content = (props) => {

    return (
        <div className='page-content'>
            { props.children }
        </div>
    );
};

Content.propTypes = {
    children: PropTypes.node,
};


export default Content;