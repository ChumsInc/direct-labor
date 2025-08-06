import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentStep, selectCurrentStepStatus} from "@/ducks/dlSteps";
import {applyTiming} from "./actions";
import type {StepTiming} from "chums-types";
import {Button, type ButtonProps} from "react-bootstrap";

export interface CurrentTimingButtonProps extends Omit<ButtonProps, 'onClick'> {
    timing: StepTiming;
}

const CurrentTimingButton = ({timing, className, children, ...btnProps}: CurrentTimingButtonProps) => {
    const dispatch = useAppDispatch();
    const step = useAppSelector(selectCurrentStep);
    const stepStatus = useAppSelector(selectCurrentStepStatus);

    const isCurrent = step?.idCurrentTiming === timing.id;

    const clickHandler = () => {
        dispatch(applyTiming(timing));
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
        <Button type="button" variant="outline-secondary" className={className}
                onClick={clickHandler} disabled={isCurrent || stepStatus !== 'idle'} {...btnProps}>
            {renderButtonChildren()}
        </Button>
    )
}

export default CurrentTimingButton
