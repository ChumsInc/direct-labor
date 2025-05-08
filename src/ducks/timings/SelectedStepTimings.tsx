import React from 'react';
import numeral from "numeral";
import {useDispatch, useSelector} from "react-redux";
import {SortableTable, SortableTableField} from "@chumsinc/sortable-tables";
import {selectCurrentStep} from "../dlSteps/index";
import {
    selectCurrentLoading,
    selectCurrentSaving,
    selectCurrentTiming,
    selectTimingList,
    selectTimingsSort
} from "./selectors";
import {setCurrentTiming, timingSortChangedAction} from "./actions";
import SelectedTimingForm from "./SelectedTimingForm";
import {newTiming} from "./utils";
import {useAppDispatch} from "../../app/configureStore";
import {SortProps, StepTiming} from "chums-types";
import CurrentTimingButton from "./CurrentTimingButton";

export interface TimingButtonProps {
    timing: StepTiming,
}


const TimingEditButton = ({timing}: TimingButtonProps) => {
    const dispatch = useDispatch();
    const clickHandler = () => {
        dispatch(setCurrentTiming(timing));
    }

    return (
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clickHandler}>Edit</button>
    )
}

const fields: SortableTableField<StepTiming>[] = [
    {field: 'id', title: 'Edit', render: (row: StepTiming) => <TimingEditButton timing={row}/>},
    {
        field: 'standardAllowedMinutes',
        title: 'SAM',
        render: (row: StepTiming) => numeral(row.standardAllowedMinutes).format('0,0.0000')
    },
    {field: 'timingDate', title: 'Date', render: (row: StepTiming) => new Date(row.timingDate).toLocaleDateString()},
    {field: 'notes', title: 'Notes'},
    {field: 'id', title: 'Action', render: (row) => <CurrentTimingButton timing={row} size="sm"/>},
];


const SelectedStepTimings = () => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectCurrentLoading);
    const saving = useSelector(selectCurrentSaving);
    const timings = useSelector(selectTimingList);
    const current = useSelector(selectCurrentTiming);
    const step = useSelector(selectCurrentStep);
    const sort = useSelector(selectTimingsSort);

    const onClickNewTiming = () => {
        if (!step?.id) {
            return;
        }
        dispatch(setCurrentTiming({...newTiming, timingDate: new Date().toISOString(), idSteps: step.id}));
    }

    const onApplyTiming = () => {
        if (!step?.id) {
            return;
        }
        // dispatch(applyTiming());
    }

    const onChangeSort = (sort: SortProps) => dispatch(timingSortChangedAction(sort));

    return (
        <div>
            {current && (<SelectedTimingForm/>)}
            {!current && (
                <>
                    <SortableTable keyField="id" fields={fields} data={timings || []} currentSort={sort}
                                   onChangeSort={onChangeSort}/>
                    <div className="row g-3">
                        <div className="col-auto">
                            <button type="button" className="btn btn-sm btn-outline-primary"
                                    disabled={loading || saving || step?.id === 0} onClick={onApplyTiming}>
                                Set Current Timing
                            </button>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    disabled={loading || saving || step?.id === 0}
                                    onClick={onClickNewTiming}>
                                New Timing
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default SelectedStepTimings;
