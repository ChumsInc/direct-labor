import React, {ChangeEvent, useEffect, useState} from "react";
import {DLStep} from "chums-types";
import {useSelector} from "react-redux";
import {selectStepsLoaded, selectStepsLoading, selectSortedStepsList} from "./index";
import {dlStepSorter, newDLStep} from "./utils";
import {loadDLSteps} from "./actions";
import {useAppDispatch} from "@/app/configureStore";
import {FormSelect} from "react-bootstrap";

export interface StepSelectProps {
    id: number;
    workCenter?: string;
    filterInactive?: boolean;
    onChange: (step?: DLStep) => void;
}


const workCenterSteps = (steps: DLStep[], workCenter?: string) => {
    return steps
        .filter(step => !workCenter || step.workCenter === workCenter)
        .sort(dlStepSorter({field: 'stepCode', ascending: true}));
}

const stepWorkCenters = (steps:DLStep[]) => {
    return [...new Set(steps.map(step => step.workCenter))];
}

const StepSelect = ({id, onChange, workCenter}:StepSelectProps) => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectStepsLoaded);
    const loading = useSelector(selectStepsLoading);
    const steps = useSelector(selectSortedStepsList);
    const [values, setValues] = useState<DLStep[]>(workCenterSteps(steps, workCenter));
    const [workCenters, setWorkCenters] = useState<string[]>(stepWorkCenters(steps));

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadDLSteps());
        }
    }, []);

    useEffect(() => {
        const values = workCenterSteps(steps, workCenter)
        setValues(values);
        setWorkCenters(stepWorkCenters(values));
    }, [steps, workCenter]);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const id = Number(ev.target.value || 0);
        const [step] = steps.filter(step => step.id === id);
        onChange(step || newDLStep);
    }

    return (
        <FormSelect value={id || ''} onChange={changeHandler} size="sm">
            <option value="">Select Step</option>
            {workCenters.map(wc => (
                <optgroup key={wc} label={wc}>
                    {values.filter(step => step.workCenter === wc)
                        .map(step => (<option key={step.id} value={step.id}>{step.stepCode} - {step.description}</option>))}
                </optgroup>
            ))}
        </FormSelect>
    )
}

export default StepSelect;
