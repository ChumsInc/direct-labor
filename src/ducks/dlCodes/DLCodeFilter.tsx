import React, {type ChangeEvent, useId} from "react";
import {useSelector} from "react-redux";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {selectFilter, selectShowInactive, selectWorkCenterFilter} from "./selectors";
import type {WorkCenter} from "chums-types";
import {loadDLCodes, setSearch, setWorkCenterFilter, toggleShowInactive} from "./actions";
import SearchInput from "@/components/common/SearchInput";
import {Button, Col, FormCheck, Row} from "react-bootstrap";
import {useAppDispatch} from "@/app/configureStore";
import {useNavigate} from "react-router";

const DLCodeFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const filter = useSelector(selectFilter);
    const wcFilter = useSelector(selectWorkCenterFilter);
    const navigate = useNavigate();
    const showInactive = useSelector(selectShowInactive);
    const idShowInactive = useId();

    const onSelectWC = (wc: WorkCenter | null) => dispatch(setWorkCenterFilter(wc?.workCenter || ''));
    const onChangeSearch = (search: string) => dispatch(setSearch(search));
    const onToggleShowInactive = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked));
    const onReloadList = () => dispatch(loadDLCodes());
    const newButtonHandler = () => navigate('/dl-codes/0');

    return (
        <Row className="g-3 mb-3 align-items-baseline">
            <Col xs="auto">
                <WorkCenterSelect value={wcFilter} onSelectWorkCenter={onSelectWC}/>
            </Col>
            <Col>
                <SearchInput onChange={onChangeSearch} value={filter}/>
            </Col>
            <Col xs="auto">
                <FormCheck label="Show Inactive" id={idShowInactive}
                           checked={showInactive} onChange={onToggleShowInactive}
                           type="checkbox"/>
            </Col>
            <Col xs="auto">
                <Button type="button" variant="outline-secondary" size="sm" onClick={newButtonHandler}>New</Button>
            </Col>
            <Col xs="auto">
                <Button type="button" size="sm" variant="primary" onClick={onReloadList}>Reload</Button>
            </Col>
        </Row>
    )
}

export default DLCodeFilter;
