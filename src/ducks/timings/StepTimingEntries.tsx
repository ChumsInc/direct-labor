import React, {FormEvent, useId, useRef, useState, FocusEvent} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentTiming} from "./selectors";
import {updateTimingEntry} from "./actions";
import TimeInput from "./TimeInput";
import classNames from "classnames";
import Decimal from "decimal.js";

const EntryList = () => {
    const dispatch = useAppDispatch();
    const timing = useSelector(selectCurrentTiming);

    const changeHandler = (index: number) => (value: number|string) => {
        dispatch(updateTimingEntry({index, value}));
    }

    const removeTiming = (index: number) => {
        dispatch(updateTimingEntry({index, value: null}))
    }

    const entryClassName = (value:string|number) => {
        const outside20Pct = new Decimal(timing?.avgTiming ?? 0).sub(value).abs().times(5);
        return classNames(
            {
                'btn-warning': outside20Pct.gt(timing?.avgTiming ?? 0),
                'btn-outline-secondary': outside20Pct.lte(timing?.avgTiming ?? 0),
            }
        )
    }

    return (
        <div className="row g-3 mb-3">
            {timing?.entries.map((entry: string | number, index: number) => (
                <div className="col-auto" key={index}>
                    <div className="input-group">
                        <TimeInput value={entry} onChange={changeHandler(index)}/>
                        <button type="button" className={classNames("btn", entryClassName(entry))} onClick={() => removeTiming(index)}>
                            <span className="bi-x"/>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

const AddNewEntry = () => {
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [time, setTime] = useState<number|string>(0);
    const id = useId();

    const onAddValue = (ev: FormEvent) => {
        ev.preventDefault();
        if (time) {
            dispatch(updateTimingEntry({index: null, value: time}));
        }
        setTime(0);
        inputRef.current?.focus();
    }

    const focusHandler = (ev:FocusEvent<HTMLInputElement>) => {
        ev.target.select();
    }

    return (
        <div className="row g-3">
            <label className="col-3" htmlFor={id}>New Entry</label>
            <div className="col-auto">
                <form onSubmit={onAddValue} className="input-group">
                    <label className="input-group-text" htmlFor={id}>Add Timing</label>
                    <TimeInput value={time || ''} onChange={setTime}
                               inputProps={{id: id, onFocus: focusHandler}}
                               ref={inputRef}>
                    </TimeInput>
                    <button type="submit" className="btn btn-outline-secondary">
                        <span className="bi-plus-lg"/>
                    </button>
                </form>
            </div>
        </div>
    )
}

const StepTimingEntries = () => {
    const timing = useSelector(selectCurrentTiming);

    if (!timing) {
        return null;
    }

    return (
        <div>
            <h3>Timing Entries <small className="text-secondary">(minutes)</small></h3>
            <EntryList/>
            <AddNewEntry/>
        </div>
    )
}

export default StepTimingEntries;
