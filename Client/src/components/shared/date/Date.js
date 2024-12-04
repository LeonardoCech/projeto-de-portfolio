// Common Imports (used in multiple components)
import React from 'react';
import PropTypes from 'prop-types';

// MomentJS
import Moment from 'react-moment';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/hi';
import 'moment/locale/hu';
import 'moment/locale/it';
import 'moment/locale/ja';
import 'moment/locale/ko';
import 'moment/locale/pl';
import 'moment/locale/pt';
import 'moment/locale/ru';

import { getLanguage } from 'utils/cookies';

import './Date.css';


const Date = (props) => {

    var timestamp = props.timestamp;

    if (`${timestamp}`.length === 10)
        timestamp *= 1000;

    var lang = getLanguage();

    lang = lang.substring(0, 2);

    const className = props.className ? ' ' + props.className : '';
    const date = <Moment local locale={lang} calendar format={props.seconds ? 'l HH:mm:ss' : ''}>
        {timestamp}
    </Moment>;

    switch (props.variation) {
        case 'dynamic':
            var fromNow = <Moment local locale={lang} fromNow>{timestamp}</Moment>;

            return (
                <span className={'date dynamic' + className}>
                    <p className='from-now'>{fromNow}</p>
                    <p className='date'>{date}</p>
                </span>
            );
        default:
            return (<span className={'date' + className}>{date}</span>);
    }
};


Date.propTypes = {
    className: PropTypes.string,
    timestamp: PropTypes.number.isRequired,
    variation: PropTypes.string,
    seconds: PropTypes.bool
};


export default Date;
