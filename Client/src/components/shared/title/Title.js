import React from 'react';
import PropTypes from 'prop-types';

import './Title.css';


const Title = (props) => {
    
    return (
        <div className={'title' + ( props.variation ? ' ' + props.variation : '')} id={ props.id }> { props.txt } </div>
    );
};


Title.propTypes = {
    id: PropTypes.string,
    txt: PropTypes.string.isRequired,
    variation: PropTypes.string.isRequired
};


export default Title;
