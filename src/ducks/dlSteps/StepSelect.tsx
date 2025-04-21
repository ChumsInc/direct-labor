import React, {ChangeEvent, useEffect} from "react";
import {DLStep} from "chums-types";
import {useSelector} from "react-redux";
import {selectStepsLoaded, selectStepsLoading, selectSortedStepsList} from "./index";
import {newDLStep} from "./utils";
import {Select} from "chums-components";
import {loadDLSteps} from "./actions";
import {useAppDispatch} from "../../app/configureStore";

export interface StepSelectProps {
    id: number,
    filterInactive?: boolean,
    onChange: (step?: DLStep) => void,
}

const StepSelect = ({id, onChange}:StepSelectProps) => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectStepsLoaded);
    const loading = useSelector(selectStepsLoading);
    const steps = useSelector(selectSortedStepsList);

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadDLSteps());
        }
    }, []);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const id = Number(ev.target.value || 0);
        const [step] = steps.filter(step => step.id === id);
        onChange(step || newDLStep);
    }

    return (
        <Select value={id || ''} onChange={changeHandler} bsSize="sm">
            <option value="">Select Step</option>
            {steps.map(step => (
                <option key={step.id} value={step.id}>{step.stepCode} - {step.description}</option>
            ))}
        </Select>
    )
}

export default StepSelect;
