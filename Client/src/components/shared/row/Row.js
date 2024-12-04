import React from 'react';
import PropTypes from 'prop-types';

import './Row.css';


const Row = (props) => {

    const a = (props.a ? ' a-' + props.a : '');
    const children = props.children;
    const className = (props.className ? ' ' + props.className : '');
    const fill = (props.fill ? ' fill-' + props.fill : '');
    const flex = (props.flex ? ' flex-' + props.flex : '');
    const g = (props.g ? ' g-' + props.g : '');
    const h = (props.h ? ' h-' + props.h : '');
    const id = (props.id ? props.id : '');
    const j = (props.j ? ' j-' + props.j : '');
    const key = (props.key ? props.key : '');
    const m = (props.m ? ' m-' + props.m : '');
    const onClick = (props.onClick ? props.onClick : () => { });
    const p = (props.p ? ' p-' + props.p : '');
    const scroll = (props.scroll ? ' scroll-' + props.scroll : '');
    const style = (props.style ? props.style : {});
    const title = (props.title ? props.title : '');
    const w = (props.w ? ' w-' + props.w : '');

    return (
        <div
            className={('row' + className + w + h + a + j + fill + flex + g + m + p + scroll).replace('  ', ' ')}
            id={id}
            key={key}
            onClick={onClick}
            style={style}
            title={title}
        >
            {children}
        </div>
    );
};


Row.propTypes = {
    a: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    fill: PropTypes.string,
    flex: PropTypes.string,
    g: PropTypes.string,
    h: PropTypes.string,
    id: PropTypes.string,
    j: PropTypes.string,
    key: PropTypes.string,
    m: PropTypes.string,
    onClick: PropTypes.func,
    p: PropTypes.string,
    scroll: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string,
    w: PropTypes.string
};


export default Row;
