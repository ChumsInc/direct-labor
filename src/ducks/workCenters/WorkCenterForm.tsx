import React, {ChangeEvent, FormEvent, useEffect, useId, useState} from "react";
import {useSelector} from "react-redux";
import {
    selectActivityCodeChanges,
    selectCurrentWorkCenter,
    selectLoading,
    selectSaving,
    selectTemplateChanges
} from "./selectors";
import {loadActivityCodeChanges, loadTemplateChanges, saveWorkCenter, setCurrentWorkCenter} from "./actions";
import {useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import SpinnerButton from "@/components/common/SpinnerButton";
import {Col, Form, FormControl, Row} from "react-bootstrap";


const WorkCenterForm = () => {
    const dispatch = useAppDispatch();
    const params = useParams<{ workCenter: string }>()
    const workCenter = useSelector(selectCurrentWorkCenter);
    const templateChanges = useAppSelector(selectTemplateChanges);
    const activityCodeChanges = useAppSelector(selectActivityCodeChanges);
    const idRate = useId();

    const saving = useSelector(selectSaving);
    const loading = useSelector(selectLoading);
    const [rate, setRate] = useState<number | string | null>(workCenter?.averageHourlyRate ?? null);

    useEffect(() => {
        if (params.workCenter) {
            dispatch(setCurrentWorkCenter(params.workCenter));
        }
    }, [params]);

    useEffect(() => {
        setRate(workCenter?.averageHourlyRate ?? null);
        if (workCenter?.workCenter) {
            dispatch(loadTemplateChanges(workCenter.workCenter));
            dispatch(loadActivityCodeChanges(workCenter.workCenter));
        }
    }, [workCenter, loading]);

    const onChangeRate = (ev: ChangeEvent<HTMLInputElement>) => {
        setRate(ev.target.valueAsNumber ?? 0);
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (!rate || !workCenter) {
            return;
        }
        dispatch(saveWorkCenter({...workCenter, averageHourlyRate: rate}));
    }

    if (!workCenter) {
        return null;
    }

    return (
        <div>
            <title>D/L WC: {workCenter.workCenter}</title>
            <Form onSubmit={onSubmit}>
                <Row className="g-3 align-items-baseline">
                    <Col xs="auto">
                        <h3>{workCenter.workCenter}</h3>
                    </Col>
                    <Col xs="auto">
                        {workCenter.workCenterDesc}
                    </Col>
                </Row>
                <Form.Group as={Row} label="Average Hourly Rate">
                    <Form.Label column sm={4} htmlFor={idRate}>Rate</Form.Label>
                    <Col>
                        <FormControl type="number" size="sm" id={idRate}
                                     onChange={onChangeRate}
                                     value={rate ?? 0}
                                     min={0} max={100} step={0.0001}/>
                    </Col>
                </Form.Group>
                <Row className="g-3 align-items-baseline justify-content-end">
                    <Col xs="auto">
                        <SpinnerButton type="submit" size="sm" spinnerProps={{size: 'sm'}}
                                       spinning={saving} disabled={loading}>
                            Save
                        </SpinnerButton>
                    </Col>
                </Row>
            </Form>


            <div className="mt-3">
                <a href={`/api/operations/production/dl/codes/template-import/${workCenter.workCenter}.txt`}
                   style={{display: 'block'}}>
                    Download Template Changes ({templateChanges})
                </a>
                <div className="text-secondary">Use VI Job: PM_TEMPLATE</div>
            </div>
            <div className="mt-1">
                <a href={`/api/operations/production/dl/codes/activity-code-import/${workCenter.workCenter}.txt`}
                   style={{display: 'block'}}>
                    Download Activity Code Changes ({activityCodeChanges})
                </a>
                <div className="text-secondary">Use VI Job: PM_ACTCODE_COST</div>
            </div>
            <div className="text-secondary mt-3">After recalculating the D/L Codes Costs, download the above files to
                import to Sage.
                <strong className="ms-3">Note:</strong> This is tested on CHU, It might not be correct correctly
                for other Work Centers.
            </div>
        </div>
    )
}
export default WorkCenterForm;
