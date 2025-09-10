import numeral from "numeral";
import {useDispatch, useSelector} from "react-redux";
import {SortableTable, type SortableTableField} from "@chumsinc/sortable-tables";
import {selectCurrentStep} from "@/ducks/dlSteps";
import {
    selectCurrentLoading,
    selectCurrentSaving,
    selectCurrentTiming,
    selectTimingList,
    selectTimingsSort
} from "@/ducks/timings/selectors.ts";
import {applyTiming, setCurrentTiming, timingSortChangedAction} from "@/ducks/timings/actions.ts";
import StepTimingForm from "./StepTimingForm.tsx";
import {newTiming} from "@/ducks/timings/utils.ts";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import type {SortProps, StepTiming} from "chums-types";
import CurrentTimingButton from "./CurrentTimingButton.tsx";
import {Button, Col, Row} from "react-bootstrap";
import {selectCurrentChanged} from "@/ducks/dlCodes/selectors.ts";

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
    const stepChanged = useAppSelector(selectCurrentChanged);

    const onClickNewTiming = () => {
        if (!step?.id) {
            return;
        }
        dispatch(setCurrentTiming({...newTiming, timingDate: new Date().toISOString(), idSteps: step.id}));
    }

    const onSetUntimed = () => {
        if (!step?.id) {
            return;
        }
        dispatch(applyTiming({...newTiming, idSteps: step.id}));
    }

    const onChangeSort = (sort: SortProps<StepTiming>) => {
        dispatch(timingSortChangedAction(sort));
    }

    return (
        <div>
            {current && (<StepTimingForm/>)}
            {!current && (
                <>
                    <SortableTable keyField="id" size="sm"
                                   fields={fields} data={timings || []} currentSort={sort}
                                   onChangeSort={onChangeSort}/>
                    <Row className="g-3">
                        <Col xs="auto">
                            <Button type="button" size="sm" variant="outline-secondary"
                                    disabled={loading || saving || !step || step?.id === 0}
                                    onClick={onClickNewTiming}>
                                New Timing
                            </Button>
                        </Col>
                        <Col xs="auto">
                            <Button type="button" size="sm" variant="outline-primary"
                                    disabled={loading || saving || !step || step?.id === 0 || stepChanged} onClick={onSetUntimed}>
                                Remove Step Timing
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    )
}

export default SelectedStepTimings;
