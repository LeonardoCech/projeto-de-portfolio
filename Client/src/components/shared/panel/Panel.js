import React from 'react';
import PropTypes from 'prop-types';

//import { makeId } from 'components/utils/general';

import './Panel.css';


const Panel = (props) => {

    const className = (props.className ? ' ' + props.className : '');
    const fill = (props.fill ? ' fill-' + props.fill : '');
    const fit = (props.fit ? ' fit-' + props.fit : '');
    const g = (props.g ? ' g-' + props.g : '');
    const h = (props.h ? ' h-' + props.h : '');
    const id = (props.id ? props.id : '');
    const j = (props.j ? ' j-' + props.j : '');
    const m = (props.m ? ' m-' + props.m : '');
    const p = (props.p ? ' p-' + props.p : '');
    const w = (props.w ? ' w-' + props.w : '');


    return (
        <div
            className={('panel container ' + className + w + h + fill + fit + g + j + m + p).replace('  ', ' ')}
            id={id}
            style={props.style}
        >
            {props.children}
        </div>
    );
};


Panel.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    fill: PropTypes.string,
    fit: PropTypes.string,
    g: PropTypes.string,
    h: PropTypes.string,
    id: PropTypes.string.isRequired,
    j: PropTypes.string,
    m: PropTypes.string,
    p: PropTypes.string,
    style: PropTypes.object,
    w: PropTypes.string
};


export default Panel;
