import React, {ChangeEvent, useEffect} from "react";
import {DLStep} from "../types";
import {useSelector} from "react-redux";
import {listSelector, loadedSelector, loadingSelector} from "./selectors";
import {newDLStep} from "./types";
import {Select} from "chums-ducks";
import {loadDLStepsAction} from "./actions";
import {useAppDispatch} from "../../app/configureStore";

export interface StepSelectProps {
    id: number,
    filterInactive?: boolean,
    onChange: (step?: DLStep) => void,
}

const StepSelect: React.FC<StepSelectProps> = ({id, onChange}) => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(loadedSelector);
    const loading = useSelector(loadingSelector);
    const steps = useSelector(listSelector({field: 'stepCode', ascending: true}));

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadDLStepsAction());
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
