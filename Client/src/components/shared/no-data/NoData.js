// Default
import React from 'react';
import PropTypes from 'prop-types';

// Antd Components
import { Row, Col } from 'antd';

import './NoData.css';

const NoData = ({ image, text, imageSize }) => {
    return (
        <Row
            justify="center"
            a="middle"
            style={{ textAlign: 'center', height: '100%' }}
        >
            <Col>
                <div className="no-data-container">
                    {image && (
                        <img src={image} alt="No Data" style={{ marginBottom: '20px', width: imageSize }} />
                    )}
                    <p className="no-data-text" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <b>{text}</b>
                    </p>
                </div>
            </Col>
        </Row>
    );
};

NoData.propTypes = {
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    imageSize: PropTypes.string,
};

NoData.defaultProps = {
    image: '',
    text: 'No data available',
    imageSize: '8rem',
};

export default NoData;
