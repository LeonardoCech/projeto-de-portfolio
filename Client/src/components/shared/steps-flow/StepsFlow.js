import React from 'react';
import PropTypes from 'prop-types';

import { Column, Row } from 'components/imports';

import { StepFlowOffSvg, StepFlowOnSvg } from 'icons/imports';

import './StepsFlow.css';


const StepsFlow = (props) => {

    var onClick = props.onClick || ((index) => { console.log(index); });

    const StepPendingIcon = <StepFlowOffSvg className='icon-svg step-pending'></StepFlowOffSvg>;
    const StepCurrentIcon = <StepFlowOnSvg className='icon-svg step-current'></StepFlowOnSvg>;
    const StepCompleteIcon = <StepFlowOnSvg className='icon-svg step-complete'></StepFlowOnSvg>;


    return (
        <Row
            className={`steps-flow ${props.className}`}
            fill='width'
            id={props.id}
        >
            {
                props.steps.map((step, index) => {
                    return (<Column fill='width' key={index} currentStep={props.currentStep} index={index} step={step}>
                        {index <= props.currentStep ?
                            <div className='fill-height enable-click' onClick={() => onClick(index)}>
                                {(index === props.currentStep ? StepCurrentIcon : StepCompleteIcon)}

                                <p>{step}</p>
                            </div> :
                            <div className='fill-height'>
                                {StepPendingIcon}

                                <p>{step}</p>
                            </div>
                        }
                    </Column>);
                })
            }
        </Row>
    );
};


StepsFlow.propTypes = {
    className: PropTypes.string,
    currentStep: PropTypes.number,
    id: PropTypes.string,
    onClick: PropTypes.func,
    steps: PropTypes.array,
};


export default StepsFlow;
