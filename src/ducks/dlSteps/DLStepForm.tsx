import React, {ChangeEvent, FormEvent, useId} from 'react';
import Alert from "react-bootstrap/Alert";
import numeral from "numeral";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {TextareaAutosize} from "@mui/base";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {
    changeDLStep,
    selectCurrentStep,
    selectCurrentStepStatus,
    selectedChangedSelector,
    selectedSavingSelector,
    selectStepsMachines
} from "./index";
import {loadDLStep, saveDLStep} from "./actions";

import {DLStep, WorkCenter} from "chums-types";
import {useAppDispatch} from "../../app/configureStore";
import Decimal from "decimal.js";
import {Button, Col, Form, FormControl, InputGroup, ProgressBar, Row} from "react-bootstrap";

const DLStepForm = () => {
    const dispatch = useAppDispatch();
    const step = useSelector(selectCurrentStep);
    const loading = useSelector(selectCurrentStepStatus);
    const changed = useSelector(selectedChangedSelector);
    const machines = useSelector(selectStepsMachines);
    const stepCodeId = useId();
    const stepActiveId = useId();
    const descriptionId = useId();
    const samId = useId();
    const uphId = useId();
    const fixedCostsId = useId();
    const totalCostId = useId();
    const machineId = useId();
    const workCenterId = useId();
    const instructionsId = useId();
    const notesId = useId();

    const changeHandler = (field: keyof DLStep) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(changeDLStep({[field]: ev.target.value}));
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
            <Form.Group as={Row}>
                <Form.Label column sm={4}>Step Code</Form.Label>
                <Col>
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={stepCodeId}>Code</InputGroup.Text>
                        <FormControl type="text" id={stepCodeId}
                                     value={step.stepCode} onChange={changeHandler('stepCode')}/>
                        <InputGroup.Text as="label" htmlFor={stepActiveId}>Active</InputGroup.Text>
                        <InputGroup.Checkbox id={stepActiveId} checked={step.active} onChange={onChangeActive}/>
                    </InputGroup>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label as="label" column sm={4} htmlFor={descriptionId}>Description</Form.Label>
                <Col>
                    <FormControl type="text" id={descriptionId} size="sm"
                                 value={step.description} onChange={changeHandler('description')}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={4}>Timing</Form.Label>
                <Col>
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={samId}>SAM</InputGroup.Text>
                        <FormControl readOnly id={samId}
                                     defaultValue={numeral(step.standardAllowedMinutes).format('0.0000')}/>
                        <InputGroup.Text as="label" htmlFor={uphId}>UPH</InputGroup.Text>
                        <FormControl readOnly id={uphId}
                                     defaultValue={uph}/>
                    </InputGroup>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={4}>Costs</Form.Label>
                <Col>
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={fixedCostsId}>Fixed Costs</InputGroup.Text>
                        <FormControl type="number" id={fixedCostsId} step="0.0001"
                                     value={step.fixedCosts} onChange={changeHandler('fixedCosts')}/>
                        <InputGroup.Text as="label" htmlFor={totalCostId}>Total Cost</InputGroup.Text>
                        <FormControl readOnly
                                     value={numeral(new Decimal(step.laborCost).add(step.fixedCosts)).format('$0.0000')}/>
                    </InputGroup>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={4} htmlFor={machineId}>Machine</Form.Label>
                <Col>
                    <FormControl type="text" size="sm"
                                 value={step.machine} onChange={changeHandler('machine')}
                                 list="input-machine-list"/>
                    <datalist id="input-machine-list">
                        {machines.map((machine, index) => (<option value={machine} key={index}/>))}
                    </datalist>

                </Col>
            </Form.Group>
            <Form.Group as={Row} label="Work Center">
                <Form.Label column sm={4} htmlFor={workCenterId}>Work Center</Form.Label>
                <Col>
                    <WorkCenterSelect id={workCenterId} size="sm"
                                      value={step.workCenter} onSelectWorkCenter={onChangeWorkCenter} required/>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={4} htmlFor={instructionsId}>Instructions</Form.Label>
                <Col>
                    <TextareaAutosize id={instructionsId}
                                      value={step.instructions ?? ''} placeholder="Instructions"
                                      className="form-control form-control-sm mb-1"
                                      onChange={changeHandler('instructions')} minRows={2}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={4} htmlFor={notesId}>Notes</Form.Label>
                <Col>
                    <TextareaAutosize id={notesId}
                                      value={step.notes ?? ''} placeholder="Notes"
                                      className="form-control form-control-sm mb-1"
                                      onChange={changeHandler('notes')} minRows={2}/>
                </Col>
            </Form.Group>

            <Row className="g-3 mt-1 justify-content-end">
                <Col xs="auto">
                    <Link to="/dl-steps/0" className="btn btn-sm btn-outline-secondary">New DL Step</Link>
                </Col>
                <Col xs="auto">
                    <Button type="button" variant="danger" size="sm"
                            disabled={loading !== 'idle' || !step.id}
                            onClick={() => window.alert('Not implemented. Call Steve if you really need this.')}>
                        Delete DL Step
                    </Button>

                </Col>
                <Col xs="auto">
                    <Button type="button" disabled={loading !== 'idle'}
                            size="sm"
                            variant="secondary"
                            onClick={onReload}>
                        Reload
                    </Button>
                </Col>
                <div className="col-auto">
                    <Button type="submit" size="sm" disabled={loading !== 'idle'}>
                        Save
                    </Button>
                </div>
            </Row>
            {loading !== 'idle' && (<ProgressBar animated striped now={100}/>)}
            {changed && <Alert variant="warning">Don&apos;t forget to save your changes.</Alert>}
        </form>
    )
}
export default DLStepForm;
