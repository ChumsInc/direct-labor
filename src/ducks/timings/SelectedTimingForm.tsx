import React, {ChangeEvent, FormEvent, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentLoading, selectCurrentSaving, selectCurrentTiming, selectTimingsIsEditing} from "./selectors";
import {DateInput, FormColumn, Input, InputGroup, SpinnerButton} from "chums-ducks";
import {changeTimingAction, editTimingAction, saveTimingAction} from "./actions";
import {DLTiming} from "../types";
import numeral from "numeral";
import {average, calcStandardAllowedMinutes} from "../../utils/math";
import "./timingForm.scss";
import {useAppDispatch} from "../../app/configureStore";

const formId = 'selected-timing-edit';

const SelectedTimingForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const timing = useSelector(selectCurrentTiming);
    const saving = useSelector(selectCurrentSaving);
    const loading = useSelector(selectCurrentLoading);
    const edit = useSelector(selectTimingsIsEditing);
    const [newEntry, setNewEntry] = useState(0);

    const newTimingRef = React.useRef<HTMLInputElement>(null);

    if (!edit) {
        return null;
    }

    const onChangeDate = (date: Date | null) => dispatch(changeTimingAction({timingDate: date || ''}));
    const onChangeEfficiency = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTimingAction({efficiency: Number(ev.target.value || 0) / 100}));
    }
    const onChange = (field: keyof DLTiming) =>
        (ev: ChangeEvent<HTMLInputElement>) => dispatch(changeTimingAction({[field]: ev.target.value}));

    const onChangeNumeric = (field: keyof DLTiming) =>
        (ev: ChangeEvent<HTMLInputElement>) => dispatch(changeTimingAction({[field]: Number(ev.target.value || 0)}));

    const changeTimingHandler = (time: number, index: number) => {
        const entries = [...timing.entries];
        if (index < 0) {
            entries.push(time);
        } else {
            entries[index] = time;
        }
        const avgTiming = average(...entries.filter(e => !!e));
        const standardAllowedMinutes = calcStandardAllowedMinutes(entries.filter(e => !!e), timing.quantityPerTiming, timing.efficiency);
        dispatch(changeTimingAction({entries, avgTiming, standardAllowedMinutes}));
    }

    const onChangeTiming = (index: number) => (ev: ChangeEvent<HTMLInputElement>) => {
        const time = Number(ev.target.value || 0);
        changeTimingHandler(time, index);
    }

    const onCancel = () => dispatch(editTimingAction());

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveTimingAction(timing));
    }

    const onChangeNewEntry = (ev: ChangeEvent<HTMLInputElement>) => {
        setNewEntry(Number(ev.target.value || 0));
    }

    const onAddNewEntry = (ev: FormEvent) => {
        ev.preventDefault();
        ev.stopPropagation();

        const time = newEntry;
        if (time === 0) {
            return;
        }
        changeTimingHandler(time, -1);
        setNewEntry(0);
        if (newTimingRef.current) {
            newTimingRef.current.focus();
        }
    }

    return (
        <div>
            <form onSubmit={onSubmit} id={formId}>
                <div className="row g-3 mb-1">
                    <div className="col-lg col-md-4 col-sm-6">
                        <label>Date</label>
                        <DateInput date={timing.timingDate || new Date()} onChangeDate={onChangeDate}/>
                    </div>
                    <div className="col-lg col-md-4 col-sm-6">
                        <label>Qty/Timing</label>
                        <Input type="number" value={timing.quantityPerTiming || ''}
                               onChange={onChangeNumeric('quantityPerTiming')}/>
                    </div>
                    <div className="col-lg col-md-4 col-sm-6">
                        <label>Efficiency</label>
                        <InputGroup bsSize="sm">
                            <Input type="number" value={Math.round((timing.efficiency) * 100) || ''}
                                   required min={1} onChange={onChangeEfficiency}/>
                            <span className="input-group-text">%</span>
                        </InputGroup>
                    </div>
                    <div className="col-lg col-md-4 col-sm-6">
                        <label>Avg Time</label>
                        <Input type="number" value={numeral(timing.avgTiming).format('0,0.00')} readOnly/>
                    </div>
                    <div className="col-lg col-md-4 col-sm-6">
                        <label>SAM</label>
                        <Input type="number" value={numeral(timing.standardAllowedMinutes).format('0,0.0000')}
                               readOnly/>
                    </div>
                </div>
                <div className="mb-1">
                    <Input value={timing.notes || ''} placeholder="Timing notes" onChange={onChange('notes')}/>
                </div>
            </form>
            <FormColumn label="Timing Entries">
                <div className="row dl-timing--entries">
                    {timing.entries.map((time, index) => (
                        <div className="col-auto" key={index}>
                            <input type="number" value={time || 0} onChange={onChangeTiming(index)}
                                   className="dl-timing--timing-entry form-control form-control-sm"/>
                        </div>
                    ))}
                    <div className="col-auto">
                        <form onSubmit={onAddNewEntry}>
                            <InputGroup bsSize="sm">
                                <input type="number" value={newEntry || ''}
                                       className="dl-timing--timing-entry  form-control form-control-sm"
                                       ref={newTimingRef} required min={0}
                                       onChange={onChangeNewEntry}/>
                                <button type="submit" className="btn btn-outline-secondary"
                                        onClick={onAddNewEntry}>Add
                                </button>
                            </InputGroup>
                        </form>
                    </div>
                </div>
            </FormColumn>
            <div>
                <SpinnerButton type="submit" color="primary" size="sm" className="me-1" form={formId}
                               spinning={saving} disabled={loading || saving}>
                    Save
                </SpinnerButton>
                <button type="button" onClick={onCancel} className="btn btn-outline-secondary btn-sm me-1"
                        form={formId}>
                    Cancel
                </button>
            </div>
            <code>
                <pre className="code">
                    {JSON.stringify(timing, undefined, 2)}
                </pre>
            </code>
        </div>
    )
}
export default SelectedTimingForm;
