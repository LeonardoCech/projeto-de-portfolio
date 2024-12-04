import React from 'react';
import PropTypes from 'prop-types';

import {
    Sentiment0Svg,
    Sentiment1Svg,
    Sentiment2Svg,
    Sentiment3Svg,
    Sentiment4Svg,
    SentimentGradient0Svg,
    SentimentGradient1Svg,
    SentimentGradient2Svg,
    SentimentGradient3Svg,
    SentimentGradient4Svg
} from 'icons/imports';

import './SentimentIcon.css';


const SetimentImg = (props) => {

    const fill = props.fill || 'gradient';
    const variation = props.variation || 'Neutral';

    switch (variation) {
        case 'Bearish':
            if (fill === 'gradient')
                return <SentimentGradient0Svg className='sentiment-icon' />;
            return <Sentiment0Svg className='sentiment-icon' />;

        case 'Somewhat-Bearish':
            if (fill === 'gradient')
                return <SentimentGradient1Svg className='sentiment-icon' />;
            return <Sentiment1Svg className='sentiment-icon' />;

        case 'Neutral':
            if (fill === 'gradient')
                return <SentimentGradient2Svg className='sentiment-icon' />;
            return <Sentiment2Svg className='sentiment-icon' />;

        case 'Somewhat-Bullish':
            if (fill === 'gradient')
                return <SentimentGradient3Svg className='sentiment-icon' />;
            return <Sentiment3Svg className='sentiment-icon' />;

        case 'Bullish':
            if (fill === 'gradient')
                return <SentimentGradient4Svg className='sentiment-icon' />;
            return <Sentiment4Svg className='sentiment-icon' />;
    }
};


SetimentImg.propTypes = {
    fill: PropTypes.string,
    variation: PropTypes.string
};


export default SetimentImg;