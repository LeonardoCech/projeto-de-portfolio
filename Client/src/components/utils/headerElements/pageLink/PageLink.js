import React from 'react';
import PropTypes from 'prop-types';

import { Row } from 'components/imports';

import './PageLink.css';


function PageLink(props) {

    const beta = props.beta ? props.beta : false;
    const id = props.id;
    const isSelected = props.isSelected ? props.isSelected : false;
    const route = props.route;
    const showText = props.showText ? props.showText : false;
    const svgIcon = props.svgIcon;
    const text = props.text;

    return (
        <a className='page-link-a' id={id} href={route}>
            <Row
                a={'center'}
                className={`page-link-button${(isSelected ? ' selected' : '')}`}
                fill='width'
            >
                {svgIcon}
                {beta ? <p title='Beta' className='beta-tag'>β</p> : <></>}
                {showText && text ? <p>{text}</p> : <></>}
            </Row>
        </a>
    );
}


PageLink.propTypes = {
    beta: PropTypes.bool,
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    route: PropTypes.string,
    showText: PropTypes.bool,
    svgIcon: PropTypes.node,
    text: PropTypes.string,
};


export default PageLink;
