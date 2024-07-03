import React, {ChangeEvent, FormEvent} from 'react';
import {Alert, FormCheck, FormColumn, Input, SpinnerButton} from "chums-components";
import numeral from "numeral";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {TextareaAutosize} from "@mui/base";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {
    selectCurrentStep,
    selectCurrentStepStatus,
    selectedChangedSelector,
    selectedSavingSelector,
    selectStepsMachines
} from "./selectors";
import {changeDLStep, loadDLStep, saveDLStep} from "./actions";
import {DLStep, WorkCenter} from "chums-types";
import {useAppDispatch} from "../../app/configureStore";
import Decimal from "decimal.js";

const DLStepForm = () => {
    const dispatch = useAppDispatch();
    const step = useSelector(selectCurrentStep);
    const loading = useSelector(selectCurrentStepStatus);
    const saving = useSelector(selectedSavingSelector);
    const changed = useSelector(selectedChangedSelector);
    const machines = useSelector(selectStepsMachines);

    const changeHandler = (field: keyof DLStep) => (ev: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        dispatch(changeDLStep({[field]: ev.target.value}));
    }
    const onChangeInstructions = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(changeDLStep({instructions: ev.target.value}));
    }
    const onChangeNotes = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(changeDLStep({notes: ev.target.value}));
    }
    const onChangeFixedCost = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeDLStep({fixedCosts: Number(ev.target.value || 0)}));
    }

    const onChangeWorkCenter = (wc: WorkCenter | null) => {
        dispatch(changeDLStep({workCenter: wc?.workCenter ?? ''}));
    }

    const onChangeActive = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeDLStep({active: ev.target.checked}));
    }

    const onReload = () => {
        if (!step) {
            return;
        }
        dispatch(loadDLStep(step.id));
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (!step) {
            return;
        }
        dispatch(saveDLStep(step));
    }

    if (!step) {
        return (
            <div>
                <div className="row g-3 mt-1 justify-content-end">
                    <div className="col-auto">
                        <Link to="/dl-steps/0" className="btn btn-sm btn-outline-secondary">New DL Step</Link>
                    </div>
                </div>
            </div>
        )
    }

    const uph = new Decimal(step.standardAllowedMinutes).eq(0) ? '0' : numeral(new Decimal(60).div(step.standardAllowedMinutes)).format('0,0.0');


    return (
        <form onSubmit={onSubmit}>
            <FormColumn label="Step Code">
                <div className="input-group">
                    <label className="input-group-text" htmlFor="sf--step-code">Code</label>
                    <Input type="text" id="sf--step-code" value={step.stepCode} onChange={changeHandler('stepCode')}/>
                    <label className="input-group-text" htmlFor="sf--step-active">Active</label>
                    <div className="input-group-text">
                        <input type="checkbox" id="sf--step-active" checked={step.active} onChange={onChangeActive} />
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-sm-6">
                    </div>
                    <div className="col-sm-6">
                    </div>
                </div>
            </FormColumn>
            <FormColumn label="Description">
                <Input type="text" value={step.description} onChange={changeHandler('description')}/>
            </FormColumn>
            <FormColumn label="Timing">
                <div className="input-group">
                    <div className="input-group-text">SAM</div>
                    <Input value={numeral(step.standardAllowedMinutes).format('0.0000')} readOnly/>
                    <div className="input-group-text">UPH</div>
                    <Input value={uph} readOnly/>
                </div>
            </FormColumn>
            <FormColumn label="Costs">
                <div className="input-group">
                    <label className="input-group-text" htmlFor="sf--fixed-costs">Fixed Costs</label>
                    <Input type="number" value={step.fixedCosts} onChange={onChangeFixedCost} step="0.0001"
                           id="sf--fixed-costs"/>
                    <label className="input-group-text" htmlFor="sf--fixed-costs">Total Cost</label>
                    <Input value={numeral(new Decimal(step.laborCost).add(step.fixedCosts)).format('$0.0000')} readOnly/>
                </div>
            </FormColumn>
            <FormColumn label="Machine">
                <Input type="text" value={step.machine} onChange={changeHandler('machine')} list="input-machine-list"/>
                <datalist id="input-machine-list">
                    {machines.map((machine, index) => (<option value={machine} key={index}/>))}
                </datalist>
            </FormColumn>
            <FormColumn label="Work Center">
                <WorkCenterSelect value={step.workCenter} onSelectWorkCenter={onChangeWorkCenter} required/>
            </FormColumn>
            <FormColumn label="Instructions">
                <TextareaAutosize value={step.instructions ?? ''} placeholder="Instructions"
                                  className="form-control form-control-sm mb-1"
                                  onChange={changeHandler('instructions')} minRows={2}/>
            </FormColumn>
            <FormColumn label="Notes">
                <TextareaAutosize value={step.notes ?? ''} placeholder="Notes"
                                  className="form-control form-control-sm mb-1"
                                  onChange={changeHandler('notes')} minRows={2}/>
            </FormColumn>

            <div className="row g-3 mt-1 justify-content-end">
                <div className="col-auto">
                    <Link to="/dl-steps/0" className="btn btn-sm btn-outline-secondary">New DL Step</Link>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" color="danger" size="sm"
                                   disabled={loading !== 'idle' || !step.id}
                                   onClick={() => window.alert('Not implemented. Call Steve if you really need this.')}
                                   spinnerAfter>
                        Delete DL Step
                    </SpinnerButton>

                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" spinning={loading === 'loading'} disabled={loading !== 'idle'} size="sm"
                                   color="secondary"
                                   onClick={onReload} spinnerAfter>
                        Reload
                    </SpinnerButton>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="submit" size="sm"
                                   spinning={loading === 'saving'} disabled={loading !== 'idle'}>
                        Save
                    </SpinnerButton>
                </div>
            </div>
            {changed && <Alert color="warning">Don't forget to save your changes.</Alert>}
        </form>
    )
}
export default DLStepForm;
