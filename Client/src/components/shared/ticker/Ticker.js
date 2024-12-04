import React from 'react';
import PropTypes from 'prop-types';

import { Column, Row } from 'components/imports';
import { currencyFormatter, percentageFormatter } from 'utils/formatters';

import './Ticker.css';


const Ticker = (props) => {

    const className = props.className ? ' ' + props.className : '';
    const variation = props.variation ? ' ' + props.variation : '';

    switch (variation.trim()) {

        default: // Tape

            var items = [...props.items, ...props.items];

            return (
                <Row className={'ticker' + className + variation} fill='width'>
                    <Row className='slide-track' fill='width'>
                        {
                            items.map((item, index) => {

                                var { icon, pnl, price, symbol } = item;

                                pnl /= 100;

                                var direction = pnl > 0 ? 'up' : 'down',
                                    variation = price * (pnl / 100);

                                variation = currencyFormatter(variation);
                                price = currencyFormatter(price);

                                return (
                                    <Row className='item' fill='width' key={symbol + '/USDT-' + index}>
                                        <Row
                                            className='coin-info'
                                            fill='width'
                                            g='0'
                                        >
                                            <img className='coin-icon' src={icon} />

                                            <Column>
                                                <p className='coin-symbol'><b>{symbol}</b></p>
                                            </Column>
                                        </Row>

                                        <Row className='price'>
                                            <p className='currency'><b>{price}</b></p>
                                            <p className={`trend-${direction}-text`}>
                                                <b>{variation}</b>
                                            </p>
                                            <p className={`trend-${direction}-text`}>
                                                <b>({percentageFormatter({ v: pnl })})</b>
                                            </p>
                                        </Row>
                                    </Row>
                                );
                            })
                        }
                    </Row>
                </Row>
            );
    }
};


Ticker.propTypes = {
    className: PropTypes.string,
    items: PropTypes.array,
    variation: PropTypes.string
};


export default Ticker;
