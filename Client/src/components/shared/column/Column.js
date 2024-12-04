import React from 'react';
import PropTypes from 'prop-types';

import './Column.css';


const Column = (props) => {

    const a = (props.a ? ' a-' + props.a : '');
    const className = (props.className ? ' ' + props.className : '');
    const fill = (props.fill ? ' fill-' + props.fill : '');
    const fit = (props.fit ? ' fit-' + props.fit : '');
    const g = (props.g ? ' g-' + props.g : '');
    const h = (props.h ? ' h-' + props.h : '');
    const id = (props.id ? props.id : '');
    const j = (props.j ? ' j-' + props.j : '');
    const m = (props.m ? ' m-' + props.m : '');
    const onClick = (props.onClick ? props.onClick : () => { });
    const onMouseEnter = (props.onMouseEnter ? props.onMouseEnter : () => { });
    const onMouseLeave = (props.onMouseLeave ? props.onMouseLeave : () => { });
    const onScroll = (props.onScroll ? props.onScroll : () => { });
    const scroll = (props.scroll ? ' scroll': '');
    const p = (props.p ? ' p-' + props.p : '');
    const w = (props.w ? ' w-' + props.w : '');


    return (
        <div
            className={('column' + a + className + w + h + scroll + fill + fit + g + j + m + p).replace('  ', ' ')}
            id={id}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onScroll={onScroll}
            style={props.style}
        >
            {props.children}
        </div>
    );
};


Column.propTypes = {
    a: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    fill: PropTypes.string,
    fit: PropTypes.string,
    g: PropTypes.string,
    h: PropTypes.string,
    id: PropTypes.string,
    j: PropTypes.string,
    m: PropTypes.string,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onScroll: PropTypes.func,
    p: PropTypes.string,
    scroll: PropTypes.bool,
    style: PropTypes.object,
    w: PropTypes.string
};


export default Column;
