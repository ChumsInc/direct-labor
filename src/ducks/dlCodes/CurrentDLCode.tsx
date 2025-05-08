import React, {ChangeEvent, FormEvent, useEffect, useId, useState} from "react";
import {Link, useParams} from 'react-router';
import {useSelector} from "react-redux";
import {selectCurrentChanged, selectCurrentDLCodeStatus, selectCurrentHeader, selectCurrentSteps} from "./selectors";
import {loadDLCode, rebuildDLCode, removeDLCode, saveDLCode} from "./actions";
import {Alert, Col, Form, FormCheck, FormControl, InputGroup, Row} from "react-bootstrap";
import {ActivityCode, DLCode, Editable, WorkCenter} from 'chums-types'
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import SelectedStepsList from "./SelectedStepsList";
import {newDLCode} from "./utils";
import numeral from "numeral";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import DLCodeSageRate from "./DLCodeSageRate";
import CurrentDLCodeTemplates from "./CurrentDLCodeTemplates";
import ActivityCodeSelect from "@/components/activity-codes/ActivityCodeSelect";
import SpinnerButton from "@/components/common/SpinnerButton";


const CurrentDLCode = () => {
    const dispatch = useAppDispatch();
    const params = useParams<'id'>();
    const status = useAppSelector(selectCurrentDLCodeStatus);
    const selected = useSelector(selectCurrentHeader);
    const steps = useSelector(selectCurrentSteps);
    const changed = useSelector(selectCurrentChanged);
    const [current, setCurrent] = useState<DLCode & Editable>({...(selected ?? newDLCode)});
    const idDLCode = useId()
    const idActive = useId();
    const idDescription = useId();
    const idLaborBudget = useId();
    const idFixedCosts = useId();
    const idTotal = useId();
    const idTimestamp = useId();
    const idActivityCode = useId();
    const idWorkCenter = useId();

    useEffect(() => {
        if (!params.id) {
            return;
        }
        dispatch(loadDLCode(params.id));
    }, [params])

    useEffect(() => {
        if (selected) {
            return setCurrent({...selected})
        }
        setCurrent({...newDLCode});
    }, [selected]);

    if (!current) {
        return (
            <Alert variant="info">Select a D/L Code</Alert>
        )
    }
    const changeHandler = (field: keyof DLCode) => (ev: ChangeEvent<HTMLInputElement>) => {
        setCurrent({...current, [field]: ev.target.value, changed: true});
    }
    const onChangeWorkCenter = (wc: WorkCenter | null) => {
        setCurrent({...current, workCenter: wc?.workCenter ?? '', changed: true});
    }

    const onChangeActivityCode = (value: ActivityCode | null) => {
        setCurrent({...current, activityCode: value?.ActivityCode ?? ''})
    }

    const onToggleActive = (ev: ChangeEvent<HTMLInputElement>) => {
        setCurrent({...current, active: ev.target.checked, changed: true});
    }

    const onReload = () => {
        if (!selected || changed || !selected.id) {
            return;
        }
        dispatch(rebuildDLCode(selected.id));
    }

    const onRemoveDLCode = () => {
        if (!selected || changed || !selected.id) {
            return;
        }
        if (!window.confirm('Are you sure you want to delete this D/L Code?')) {
            return;
        }
        dispatch(removeDLCode(selected.id));
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveDLCode(current));
    }

    return (
        <div>
            <title>D/L Code: {current.dlCode}</title>

            <div className="card">
                <div className="card-header">
                    <h2>D/L Code Editor: <strong>{current.workCenter}/{current.dlCode}</strong></h2>
                </div>
                <div className="card-body">
                    <Form onSubmit={onSubmit}>
                        <Form.Group as={Row} className="g-3 align-items-baseline">
                            <Form.Label column sm={3} htmlFor={idDLCode}>Direct Labor Code</Form.Label>
                            <Col>
                                <InputGroup size="sm">
                                    <FormControl type="text" id={idDLCode}
                                                 value={current.dlCode} onChange={changeHandler('dlCode')}/>
                                    <InputGroup.Text>ID: {current.id}</InputGroup.Text>
                                </InputGroup>
                            </Col>
                            <Col xs="auto">
                                <FormCheck type="checkbox" id={idActive} label="Active"
                                           checked={current.active} onChange={onToggleActive}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="g-3 align-items-baseline">
                            <Form.Label column sm={3} htmlFor={idWorkCenter}>Work Center</Form.Label>
                            <Col>
                                <WorkCenterSelect value={current.workCenter} required size="sm" id={idWorkCenter}
                                                  onSelectWorkCenter={onChangeWorkCenter}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="g-3 align-items-baseline">
                            <Form.Label column sm={3} htmlFor={idDLCode}>Description</Form.Label>
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Text><span className="bi-card-text" /></InputGroup.Text>
                                    <FormControl type="text" id={idDescription}
                                                 value={current.description} onChange={changeHandler('description')}/>
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="g-3 align-items-baseline">
                            <Form.Label column sm={3}>Sage Activity</Form.Label>
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Text as="label" htmlFor={idActivityCode}>
                                        <span className="visually-hidden">Activity Code</span>
                                        <span className="bi-activity" aria-hidden={true}/>
                                    </InputGroup.Text>
                                    <ActivityCodeSelect workCenter={current.workCenter}
                                                        value={current.activityCode ?? ''}
                                                        onChange={onChangeActivityCode}/>
                                </InputGroup>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="g-3 align-items-baseline" label="Costs" width={9}>
                            <Form.Label column sm={3}>Costs</Form.Label>
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Text as="label" htmlFor={idLaborBudget}>Labor</InputGroup.Text>
                                    <FormControl type="text" id={idLaborBudget}
                                                 value={numeral(current.laborBudget).format('$0,0.0000')}
                                                 readOnly
                                                 className="text-end"/>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Text as="label" htmlFor={idFixedCosts}>Fixed</InputGroup.Text>
                                    <FormControl type="text" id={idFixedCosts}
                                                 value={numeral(current.fixedCosts).format('$0,0.0000')}
                                                 readOnly
                                                 className="text-end"/>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Text as="label" htmlFor={idTotal}>Total</InputGroup.Text>
                                    <FormControl type="text" id={idTotal}
                                                 value={numeral(current.directLaborCost).format('$0,0.0000')}
                                                 readOnly
                                                 className="text-end"/>
                                </InputGroup>

                            </Col>
                        </Form.Group>
                        {!!current.timestamp && (
                            <Form.Group as={Row} className="g-3  align-items-baseline" label="Last Updated" width={9}>
                                <Form.Label column sm={3} htmlFor={idTimestamp}>Last Updated</Form.Label>
                                <Col>
                                    <FormControl plaintext id={idTimestamp}
                                                 defaultValue={new Date(current.timestamp).toLocaleString()}/>
                                </Col>
                            </Form.Group>
                        )}
                        <Form.Group as={Row} className="g-3  align-items-baseline">
                            <Form.Label column sm={3}>Sage Template Data</Form.Label>
                            <DLCodeSageRate/>
                        </Form.Group>


                        <Row className="mt-3 justify-content-end">
                            <Col xs="auto">
                                <SpinnerButton type="button" variant="outline-danger"
                                               spinning={status === 'deleting'}
                                               disabled={status !== 'idle' || !!steps.length || !current.id} size="sm"
                                               onClick={onRemoveDLCode}>
                                    Delete DL Code
                                </SpinnerButton>

                            </Col>
                            <div className="col-auto">
                                <Link to="/dl-codes/0" className="btn btn-sm btn-outline-secondary">New DL Code</Link>
                            </div>
                            <div className="col-auto">
                                <SpinnerButton type="button" spinning={status === 'loading'}
                                               disabled={status !== 'idle'} size="sm"
                                               variant="secondary"
                                               onClick={onReload}>
                                    Rebuild Cost
                                </SpinnerButton>
                            </div>
                            <div className="col-auto">
                                <SpinnerButton type="submit" spinning={status === 'saving'} disabled={status !== 'idle'}
                                               size="sm">
                                    Save
                                </SpinnerButton>
                            </div>
                        </Row>
                        {changed && <Alert variant="warning">Don't forget to save your changes.</Alert>}
                    </Form>
                </div>
                <hr/>
                <div className="card-body">
                    <h3>Steps</h3>
                    {!!selected?.id && <SelectedStepsList/>}
                </div>
                <hr/>
                <div className="card-body">
                    <h3>Where Used in Templates</h3>
                    <CurrentDLCodeTemplates/>
                </div>
            </div>
        </div>
    )
}

export default CurrentDLCode;
