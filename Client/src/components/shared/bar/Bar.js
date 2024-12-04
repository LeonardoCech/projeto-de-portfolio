import React from 'react';
import PropTypes from 'prop-types';

import { Row } from 'components/imports';

import './Bar.css';


const Bar = (props) => {

    const className =  props.className ? ' ' + props.className : '';
    const id = props.id ? ' ' + props.id : '';
    const progress = props.progress ? props.progress : 0;

    return (
        <Row className={'bar' + className } id={id}>
            <span className='progress' style={{ width: progress + '%' }}></span>
        </Row>
    );
};


Bar.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    progress: PropTypes.number,
};


export default Bar;
