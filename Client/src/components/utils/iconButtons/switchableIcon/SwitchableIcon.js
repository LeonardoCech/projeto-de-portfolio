import React from 'react';
import PropTypes from 'prop-types';

import { Row } from 'components/imports';

import './SwitchableIcon.css';


const SwitchableIcon = (props) => {

    const className = props.className ? ' ' + props.className : null;
    const id = props.id;
    const isOn = props.isOn ? props.isOn : false;
    const offImage = props.offImage;
    const onImage = props.onImage;
    const onToggle = props.onToggle ? props.onToggle : () => { console.log('change me'); };
    const showText = props.showText ? props.showText : false;
    const staticImage = props.staticImage;
    const text = props.text ? props.text : '';
    const title = props.title || '';

    const imageSrc = staticImage ? staticImage : (isOn ? onImage : offImage);

    return (
        <Row
            a={'center'}
            className={'switchable-icon' + (className != null ? className : '')}
            fill={showText ? 'width' : 'none'}
            g='0'
            id={id}
            onClick={onToggle}
            title={title}
        >
            {imageSrc}

            {showText && text ? <p className='fill-text'>{text}</p> : null}
        </Row>
    );
};


SwitchableIcon.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    isOn: PropTypes.bool,
    offImage: PropTypes.object,
    onImage: PropTypes.object,
    onToggle: PropTypes.func,
    showText: PropTypes.bool,
    staticImage: PropTypes.object,
    text: PropTypes.string,
    title: PropTypes.string
};


export default SwitchableIcon;
