import React, {ChangeEvent, useState} from 'react';
import StepSelect from "@/ducks/dlSteps/StepSelect";
import {DLStep} from "chums-types";
import {addDLStep} from "@/ducks/dlCodes/actions";
import {newDLStep} from "@/ducks/dlSteps/utils";
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentHeader} from "@/ducks/dlCodes/selectors";
import {Button, Col, Row} from "react-bootstrap";
import WorkCenterSelect from "@/ducks/workCenters/WorkCenterSelect";

export default function AddDLStepForm() {
    const dispatch = useAppDispatch();
    const dlCode = useSelector(selectCurrentHeader);
    const [workCenter, setWorkCenter] = useState<string>('');
    const [newStep, setNewStep] = useState(newDLStep);

    const onChangeNewStep = (step?: DLStep) => {
        setNewStep(step || newStep);
    }

    const onAddStep = () => {
        if (!dlCode || newStep.id === 0) {
            return;
        }
        dispatch(addDLStep({id: dlCode.id, stepId: newStep.id}));
        setNewStep(newDLStep);
    }

    const wcChangeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        setWorkCenter(ev.target.value);
    }

    return (
        <Row className="row g-3">
            <Col xs={4}>
                <WorkCenterSelect value={workCenter} onChange={wcChangeHandler} size="sm" />
            </Col>
            <Col>
                <StepSelect id={newStep.id} onChange={onChangeNewStep} filterInactive workCenter={workCenter}/>
            </Col>
            <Col xs="auto">
                <Button type="button" variant="outline-secondary" size="sm" disabled={!newStep.id} onClick={onAddStep}>
                    Add Step
                </Button>
            </Col>
        </Row>
    )
}
