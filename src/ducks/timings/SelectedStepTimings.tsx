import React from 'react';
import {DLTiming, DLTimingTableField} from "../types";
import numeral from "numeral";
import {useDispatch, useSelector} from "react-redux";
import {FormCheck, SortableTable} from "chums-ducks";
import {selectedStepSelector} from "../dlSteps/selectors";
import {dlStepChangeTimingAction} from "../dlSteps/actions";
import {editTimingSelector, listSelector, selectedLoadingSelector, selectedSavingSelector} from "./selectors";
import {editTimingAction} from "./actions";
import SelectedTimingForm from "./SelectedTimingForm";
import {newTiming} from "./types";

export interface TimingRadioProps {
    timing: DLTiming,
}

const TimingRadio: React.FC<TimingRadioProps> = ({timing}) => {
    const dispatch = useDispatch();
    const selected = useSelector(selectedStepSelector);
    const clickHandler = () => dispatch(dlStepChangeTimingAction(timing));
    return (
        <FormCheck label={numeral(timing.standardAllowedMinutes).format('0.0000')}
                   checked={selected.idCurrentTiming === timing.id}
                   onClick={clickHandler} type="radio"/>
    )
}

const TimingEditButton: React.FC<TimingRadioProps> = ({timing}) => {
    const dispatch = useDispatch();
    const clickHandler = () => {
        dispatch(editTimingAction(timing));
    }

    return (
        <button type="button" className="btn btn-xs btn-outline-secondary" onClick={clickHandler}>Edit</button>
    )
}

const fields: DLTimingTableField[] = [
    {field: 'id', title: 'SAM', render: (row: DLTiming) => <TimingRadio timing={row}/>},
    {field: 'timingDate', title: 'Date', render: (row: DLTiming) => new Date(row.timingDate).toLocaleDateString()},
    {field: 'notes', title: 'Notes'},
    {field: 'timestamp', title: 'Edit', render: (row: DLTiming) => <TimingEditButton timing={row}/>}
];


const SelectedStepTimings: React.FC = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectedLoadingSelector);
    const saving = useSelector(selectedSavingSelector);
    const timings = useSelector(listSelector);
    const edit = useSelector(editTimingSelector);
    const onClickNewTiming = () => {
        dispatch(editTimingAction(newTiming));
    }

    return (
        <div>
            {edit && (<SelectedTimingForm/>)}
            {!edit && (
                <>
                    <SortableTable tableKey="selected-step-timings" keyField="id" fields={fields} data={timings || []}
                                   size="xs"/>
                    <button type="button" className="btn btn-sm btn-outline-secondary" disabled={loading || saving}
                            onClick={onClickNewTiming}>
                        New Timing
                    </button>
                </>
            )}
        </div>
    )
}

export default SelectedStepTimings;
