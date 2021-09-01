import React, {ChangeEvent, FormEvent} from 'react';
import {Alert, FormColumn, Input, SpinnerButton} from "chums-ducks";
import numeral from "numeral";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import TextAreaAutosize from "react-textarea-autosize";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    machinesSelector,
    selectedChangedSelector,
    selectedLoadingSelector,
    selectedSavingSelector,
    selectedStepSelector
} from "./selectors";
import {dlStepChangedAction, loadDLStepAction} from "./actions";
import {DLStep, WorkCenter} from "../types";
import {dlCodeChangedAction} from "../dlCodes/actions";

const DLStepForm: React.FC = () => {
    const dispatch = useDispatch();
    const step = useSelector(selectedStepSelector);
    const loading = useSelector(selectedLoadingSelector);
    const saving = useSelector(selectedSavingSelector);
    const changed = useSelector(selectedChangedSelector);
    const machines = useSelector(machinesSelector);

    const changeHandler = (field: keyof DLStep) => (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(dlStepChangedAction({[field]: ev.target.value}));
    }
    const onChangeInstructions = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(dlStepChangedAction({instructions: ev.target.value}));
    }
    const onChangeFixedCost = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(dlStepChangedAction({fixedCosts: Number(ev.target.value || 0)}));
    }

    const onChangeWorkCenter = (wc: WorkCenter | null) => {
        dispatch(dlCodeChangedAction({workCenter: wc?.WorkCenterCode || ''}));
    }

    const onReload = () => {
        dispatch(loadDLStepAction(step));
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
    }
    const {
        stepCode,
        laborCost,
        fixedCosts,
        workCenter,
        instructions,
        notes,
        description,
        machine,
        standardAllowedMinutes
    } = step;

    return (
        <form onSubmit={onSubmit}>
            <FormColumn label="Step Code">
                <Input type="text" value={stepCode} onChange={changeHandler('stepCode')}/>
            </FormColumn>
            <FormColumn label="Description">
                <Input type="text" value={description} onChange={changeHandler('description')}/>
            </FormColumn>
            <FormColumn label="SAM">
                <div className="row g-3 align-items-baseline">
                    <div className="col-4">
                        <Input value={numeral(standardAllowedMinutes).format('0.0000')} readOnly/>
                    </div>
                    <div className="col-4">
                        <label className="form-label">UPH</label>
                    </div>
                    <div className="col-4">
                        <Input
                            value={!standardAllowedMinutes ? '0' : numeral(60 / standardAllowedMinutes).format('0,0.0')}
                            readOnly/>
                    </div>
                </div>
            </FormColumn>
            <FormColumn label="Fixed Costs">
                <div className="row g-3 align-items-baseline">
                    <div className="col-4">
                        <Input type="number" value={fixedCosts} onChange={onChangeFixedCost} step="0.0001"/>
                    </div>
                    <div className="col-4">
                        <label>Total Cost</label>
                    </div>
                    <div className="col-4">
                        <Input value={numeral(laborCost + fixedCosts).format('$0.0000')} readOnly/>
                    </div>
                </div>
            </FormColumn>
            <FormColumn label="Machine">
                <Input type="text" value={machine} onChange={changeHandler('machine')} list="input-machine-list"/>
                <datalist id="input-machine-list">
                    {machines.map((machine, index) => (<option value={machine} key={index}/>))}
                </datalist>
            </FormColumn>
            <FormColumn label="Work Center">
                <WorkCenterSelect value={workCenter} onSelectWorkCenter={onChangeWorkCenter}/>
            </FormColumn>
            <FormColumn label="Instructions">
                <TextAreaAutosize value={instructions || ''} placeholder="Instructions"
                                  className="form-control form-control-sm mb-1"
                                  onChange={onChangeInstructions} minRows={2}/>
            </FormColumn>

            <div className="row g-3 mt-1">
                <div className="col-auto">
                    <SpinnerButton type="submit" spinning={saving} disabled={loading || saving} size="sm"
                                   spinnerAfter>
                        Save
                    </SpinnerButton>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" spinning={saving} color="danger"
                                   disabled={loading || saving || !step.id} size="sm"
                                   spinnerAfter>
                        Delete DL Code
                    </SpinnerButton>

                </div>
                <div className="col-auto">
                    <Link to="/dl-codes/0" className="btn btn-sm btn-outline-secondary">New DL Code</Link>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" spinning={loading} disabled={loading || saving} size="sm"
                                   color="secondary"
                                   onClick={onReload} spinnerAfter>
                        Reload
                    </SpinnerButton>
                </div>
            </div>
            {changed && <Alert color="warning">Don't forget to save your changes.</Alert>}
        </form>
    )
}
export default DLStepForm;
