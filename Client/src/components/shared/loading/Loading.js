import React from 'react';

import { MinhasFinancasLogoSvg } from 'icons/imports';

import './Loading.css';


const Loading = () => {

    return (
        <div className='loading-overlay'>
            <MinhasFinancasLogoSvg id='loading-logo' />
        </div>
    );
};


export default Loading;
