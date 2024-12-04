import React from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import { Link } from 'components/imports';
import { ConfirmSvg } from 'icons/imports';

import './ReadDoc.css';


const ReadDoc = (props) => {

    const { t } = useTranslation();
    const confirmIcon = <ConfirmSvg className={'icon-svg' + ' ' + (props.isRead ? 'read' : '')} />;

    return (
        <div className={'read-doc ' + props.className} id={props.id}>
            <div>
                <p><b>{props.label}</b></p>
                {props.isRead ? confirmIcon : null}
            </div>

            <Link href={props.href} onClick={props.onOpenDoc}>{t('open-doc')}</Link>
        </div>
    );
};


ReadDoc.propTypes = {
    className: PropTypes.string,
    href: PropTypes.string,
    id: PropTypes.string,
    isRead: PropTypes.bool,
    label: PropTypes.string,
    onOpenDoc: PropTypes.func
};


export default ReadDoc;
