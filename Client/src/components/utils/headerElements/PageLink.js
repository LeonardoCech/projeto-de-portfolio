import React from 'react';


// eslint-disable-next-line react/prop-types
function PageLink({ id, route, text, isSelected = false, hasBar = true }) {

    var bar = hasBar ? <span id={id + '-span'} className={isSelected ? 'selected-page-button' : ''}></span> : '';

    return (
        <div className='page-link-button'>
            <a id={id} href={route}>{text}</a>
            {bar}
        </div>
    );
}

export default PageLink;
