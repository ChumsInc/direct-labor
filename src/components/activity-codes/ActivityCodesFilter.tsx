import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import WorkCenterSelect from "@/ducks/workCenters/WorkCenterSelect";
import {useSelector} from "react-redux";
import {
    selectActivityCodesFilter,
    selectActivityCodesUnratedWCs,
    selectActivityCodesWithoutTemplates,
    selectActivityCodesWorkCenter
} from "@/ducks/activity-codes/selectors";
import {
    loadActivityCodes,
    setActivityCodeSearch,
    setActivityCodesWorkCenter, toggleActivityCodesWOTemplates,
    toggleUnratedWorkCenters
} from "@/ducks/activity-codes/actions";
import {Button, Col, FormCheck, FormControl, Row} from "react-bootstrap";

const ActivityCodesFilter = () => {
    const dispatch = useAppDispatch();
    const workCenter = useSelector(selectActivityCodesWorkCenter);
    const unrated = useSelector(selectActivityCodesUnratedWCs);
    const search = useSelector(selectActivityCodesFilter);
    const showACWoTemplates = useAppSelector(selectActivityCodesWithoutTemplates);
    const idWOTemplates = useId();
    const idUnrated = useId();

    const wcChange = (ev:ChangeEvent<HTMLSelectElement>) => {
        dispatch(setActivityCodesWorkCenter(ev.target.value));
    }

    const onToggleUnrated = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleUnratedWorkCenters(ev.target.checked));
    }

    const onToggleWithoutAC = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleActivityCodesWOTemplates(ev.target.checked));
    }

    const searchChangeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(setActivityCodeSearch(ev.target.value));
    }

    const reloadHandler = () => {
        dispatch(loadActivityCodes());
    }

    return (
        <div>
            <Row className="g-3 mb-1 align-items-baseline">
                <Col className="col">
                    <FormControl type="search" size="sm" value={search} placeholder="Search"
                           onChange={searchChangeHandler}/>
                </Col>
                <Col xs="auto">
                    <Button type="button" variant="outline-primary" size="sm" onClick={reloadHandler}>Reload</Button>
                </Col>
            </Row>
            <Col className="row g-3 align-items-baseline">
                <Col>
                    <WorkCenterSelect value={workCenter} includeUnrated={unrated} onChange={wcChange} size="sm" />
                </Col>
                <Col xs="auto">
                    <FormCheck type="checkbox" id={idUnrated}
                               checked={unrated} onChange={onToggleUnrated}
                               disabled={workCenter !== ''} label="Show Inactive W/C" />
                </Col>
                <Col xs="auto">
                    <FormCheck type="checkbox" id={idWOTemplates}
                               checked={showACWoTemplates} onChange={onToggleWithoutAC}
                               label="Show Activity Codes w/o Templates" />
                </Col>
            </Col>
        </div>
    )
}

export default ActivityCodesFilter;
