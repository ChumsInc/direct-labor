import React, {ButtonHTMLAttributes} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCurrentStep, selectCurrentStepStatus} from "../dlSteps/selectors";
import {setCurrentTiming} from "./actions";
import {StepTiming} from "chums-types";
import classNames from "classnames";

export interface CurrentTimingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    timing: StepTiming;
}
const CurrentTimingButton = ({timing, className, children, onClick, ...btnProps}: CurrentTimingButtonProps) => {
    const dispatch = useAppDispatch();
    const step = useAppSelector(selectCurrentStep);
    const stepStatus = useAppSelector(selectCurrentStepStatus);

    const isCurrent = step?.idCurrentTiming === timing.id;

    const clickHandler = () => {
        dispatch(setCurrentTiming(timing));
    }

    const renderButtonChildren = () => {
        if (children) {
            return children;
        }
        return (
            <>
                {isCurrent ? 'Current Timing' : 'Apply Timing'}
            </>
        )
    }

    return (
        <button type="button" className={classNames('btn btn-outline-primary', className)}
                onClick={clickHandler} disabled={isCurrent || stepStatus !== 'idle'} {...btnProps}>
            {renderButtonChildren()}
        </button>
    )
}

export default CurrentTimingButton
