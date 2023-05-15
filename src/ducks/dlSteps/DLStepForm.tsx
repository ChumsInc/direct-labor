import React, {ChangeEvent, FormEvent} from 'react';
import {Alert, FormCheck, FormColumn, Input, SpinnerButton} from "chums-components";
import numeral from "numeral";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import TextAreaAutosize from "react-textarea-autosize";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {
    machinesSelector,
    selectedChangedSelector,
    selectedLoadingSelector,
    selectedSavingSelector,
    selectedStepSelector
} from "./selectors";
import {dlStepChangedAction, loadDLStepAction, saveDLStepAction} from "./actions";
import {DLStep, WorkCenter} from "../types";
import {useAppDispatch} from "../../app/configureStore";

const DLStepForm: React.FC = () => {
    const dispatch = useAppDispatch();
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
    const onChangeNotes = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(dlStepChangedAction({notes: ev.target.value}));
    }
    const onChangeFixedCost = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(dlStepChangedAction({fixedCosts: Number(ev.target.value || 0)}));
    }

    const onChangeWorkCenter = (wc: WorkCenter | null) => {
        dispatch(dlStepChangedAction({workCenter: wc?.WorkCenterCode || ''}));
    }

    const onChangeActive = () => {
        dispatch(dlStepChangedAction({active: !step.active}));
    }

    const onReload = () => {
        dispatch(loadDLStepAction(step));
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveDLStepAction(step));
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
        standardAllowedMinutes,
        active,
    } = step;

    return (
        <form onSubmit={onSubmit}>
            <FormColumn label="Step Code">
                <div className="row g-3">
                    <div className="col-sm-6">
                        <Input type="text" value={stepCode} onChange={changeHandler('stepCode')}/>
                    </div>
                    <div className="col-sm-6">
                        <FormCheck label="Active" checked={active} onClick={onChangeActive} type="checkbox"/>
                    </div>
                </div>
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
            <FormColumn label="Notes">
                <TextAreaAutosize value={notes || ''} placeholder="Notes"
                                  className="form-control form-control-sm mb-1"
                                  onChange={onChangeNotes} minRows={2}/>
            </FormColumn>

            <div className="row g-3 mt-1">
                <div className="col-auto">
                    <SpinnerButton type="submit" spinning={saving} disabled={loading || saving} size="sm"
                                   spinnerAfter>
                        Save
                    </SpinnerButton>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" color="danger"
                                   disabled={loading || saving || !step.id} size="sm"
                                   onClick={() => window.alert('Not implemented. Call Steve if you really need this.')}
                                   spinnerAfter>
                        Delete DL Step
                    </SpinnerButton>

                </div>
                <div className="col-auto">
                    <Link to="/dl-steps/0" className="btn btn-sm btn-outline-secondary">New DL Step</Link>
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
