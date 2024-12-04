
import React from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import { Column, Link, Row } from 'components/imports';

import './UserCard.css';


const UserCard = (props) => {

    const { t } = useTranslation();

    const fullname = props.fullname;
    const onClick = props.onClick || (() => {});
    const username = props.username;

    return (
        <Row className='user-card' fill='width' >
            <Column fill='width' >
                <h3>{fullname}</h3>
                <p>{username}</p>
            </Column>

            <Link onClick={onClick}>{t('restart')}</Link>
        </Row>
    );
};


UserCard.propTypes = {
    fullname: PropTypes.string,
    onClick: PropTypes.func,
    username: PropTypes.string
};


export default UserCard;
