import React, {type ChangeEvent, type FormEvent, useId} from "react";
import {useSelector} from "react-redux";
import {selectCurrentTiming, selectCurrentTimingActionStatus} from "@/ducks/timings/selectors.ts";
import {saveTiming, setCurrentTiming, updateCurrentTiming} from "@/ducks/timings/actions.ts";
import type {StepTiming} from "chums-types";
import numeral from "numeral";
import {unitsPerHour} from "@/utils/math.ts";
import {useAppDispatch} from "@/app/configureStore.ts";
import Decimal from "decimal.js";
import dayjs from "dayjs";
import StepTimingEntries from "./StepTimingEntries.tsx";
import CurrentTimingButton from "./CurrentTimingButton.tsx";
import SpinnerButton from "@/components/common/SpinnerButton.tsx";
import TextArea from "@/components/common/TextArea.tsx";
import styled from "@emotion/styled";

const formId = 'selected-stepTiming-edit';

const TimingFormContainer = styled.div`
    input.dl-timing--timing-entry {
        min-width: 5em;
        max-width: 7em;
        text-align: end;
        margin-bottom: 0.25rem;
    }

    .input-group {
        input.dl-timing--timing-entry {
            margin-bottom: 0;
        }
    }
`

const StepTimingForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const stepTiming = useSelector(selectCurrentTiming);
    const actionStatus = useSelector(selectCurrentTimingActionStatus);
    const id = useId();

    if (!stepTiming) {
        return null;
    }

    const onChangeDate = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.valueAsDate && dayjs(ev.target.valueAsDate).isValid()) {
            dispatch(updateCurrentTiming({timingDate: ev.target.valueAsDate.toISOString()}));
            return;
        }
        dispatch(updateCurrentTiming({timingDate: ''}));
    }
    const onChangeEfficiency = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateCurrentTiming({efficiency: Number(ev.target.value || 0) / 100}));
    }
    const onChange = (field: keyof StepTiming) =>
        (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => dispatch(updateCurrentTiming({[field]: ev.target.value}));

    const onChangeNumeric = (field: keyof StepTiming) =>
        (ev: ChangeEvent<HTMLInputElement>) => dispatch(updateCurrentTiming({[field]: Number(ev.target.value || 0)}));

    const onCancel = () => dispatch(setCurrentTiming(null));

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveTiming(stepTiming));
    }

    return (
        <TimingFormContainer>
            <h3>Timing Editor</h3>
            <form onSubmit={onSubmit} id={formId}>
                <div className="row g-3 mb-1">
                    <div className="col-sm col-12">
                        <div className="input-group">
                            <label className="input-group-text" htmlFor={`${id}-date`}>Date</label>
                            <input type="date" className="form-control" id={`${id}-date`}
                                   value={dayjs(stepTiming.timingDate ?? new Date()).format('YYYY-MM-DD')}
                                   onChange={onChangeDate}/>
                        </div>
                    </div>
                    <div className="col-sm col-12">
                        <div className="input-group">
                            <label className="input-group-text" htmlFor={`${id}-qty`}>Qty/Timing</label>
                            <input type="number" className="form-control text-end" id={`${id}-qty`}
                                   value={stepTiming.quantityPerTiming || ''}
                                   min={1} step={1} required
                                   onChange={onChangeNumeric('quantityPerTiming')}/>
                        </div>
                    </div>
                    <div className="col-sm col-12">
                        <div className="input-group">
                            <label className="input-group-text" htmlFor={`${id}-efficiency`}>Efficiency</label>
                            <input type="number" className="form-control text-end" id={`${id}-efficiency`}
                                   value={new Decimal(stepTiming.efficiency ?? 1).times(100).toDecimalPlaces(0).toNumber() || ''}
                                   required min={1} onChange={onChangeEfficiency} step={1}/>
                            <span className="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col">
                        <div className="input-group">
                            <label className="input-group-text" htmlFor={`${id}-avg-time`}>Avg. Time</label>
                            <input type="text" className="form-control text-end" id={`${id}-avg-time`}
                                   value={numeral(stepTiming.avgTiming).format('0,0.00')} readOnly/>
                        </div>
                    </div>
                    <div className="col">
                        <div className="input-group">
                            <label className="input-group-text" htmlFor={`${id}-sam`}
                                   title="Standard Allowed Minutes">SAM</label>
                            <input type="text" className="form-control text-end" id={`${id}-sam`}
                                   value={numeral(stepTiming.standardAllowedMinutes).format('0,0.0000')}
                                   readOnly/>
                        </div>
                    </div>
                    <div className="col">
                        <div className="input-group">
                            <label className="input-group-text" htmlFor={`${id}-uph`}
                                   title="Units per Hour">UPH</label>
                            <input type="text" className="form-control text-end" id={`${id}-uph`}
                                   value={unitsPerHour(stepTiming.standardAllowedMinutes)}
                                   readOnly/>
                        </div>
                    </div>
                </div>
                <div className="mb-1">
                    <label htmlFor={`${id}-timing-notes`}>Notes</label>
                    <TextArea className="form-control" id={`${id}-timing-notes`} value={stepTiming.notes || ''}
                              placeholder="Timing notes" onChange={onChange('notes')}/>
                </div>
            </form>
            <StepTimingEntries/>
            <div className="row g-3 mt-3">
                <div className="col"></div>
                <div className="col-auto">
                    <button type="button" onClick={onCancel} className="btn btn-outline-secondary"
                            form={formId}>
                        Close
                    </button>
                </div>
                <div className="col-auto">
                    <CurrentTimingButton timing={stepTiming}/>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="submit" variant="primary" form={formId}
                                   spinning={actionStatus === 'saving'} disabled={actionStatus !== 'idle'}>
                        Save
                    </SpinnerButton>
                </div>
            </div>
        </TimingFormContainer>
    )
}
export default StepTimingForm;
