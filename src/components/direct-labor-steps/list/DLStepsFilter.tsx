import {type ChangeEvent, useId} from "react";
import {useSelector} from "react-redux";
import WorkCenterSelect from "@/ducks/workCenters/WorkCenterSelect.tsx";
import {
    selectFilterInactive,
    selectStepsFilter,
    selectStepsLoading,
    selectWCFilter,
    setStepFilter,
    setStepWCFilter,
    toggleShowInactive
} from "@/ducks/dlSteps";
import type {WorkCenter} from "chums-types";
import {loadDLSteps} from "@/ducks/dlSteps/actions.ts";
import SearchInput from "@/components/common/SearchInput.tsx";
import {useAppDispatch} from "@/app/configureStore.ts";
import {useNavigate} from "react-router";
import {Button, Col, FormCheck, Row} from "react-bootstrap";
import SpinnerButton from "@/components/common/SpinnerButton.tsx";

const DLCodeFilter = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const filter = useSelector(selectStepsFilter);
    const wcFilter = useSelector(selectWCFilter);
    const loading = useSelector(selectStepsLoading);
    const filterInactive = useSelector(selectFilterInactive);
    const idShowInactive = useId();

    const onSelectWC = (wc: WorkCenter | null) => dispatch(setStepWCFilter(wc?.workCenter ?? ''));
    const onChangeSearch = (search:string) => dispatch(setStepFilter(search));
    const onReloadList = () => dispatch(loadDLSteps());
    const onToggleShowInactive = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked));

    const newButtonHandler = () => {
        navigate('/dl-steps/0');
    }

    return (
        <Row className="g-3 align-items-baseline">
            <Col xs="auto">
                <WorkCenterSelect value={wcFilter} onSelectWorkCenter={onSelectWC} size="sm"/>
            </Col>
            <Col>
                <SearchInput onChange={onChangeSearch} value={filter} size="sm"/>
            </Col>
            <Col xs="auto">
                <FormCheck label="Show Inactive" id={idShowInactive}
                           checked={filterInactive} onChange={onToggleShowInactive}
                           type="checkbox"/>
            </Col>
            <Col xs="auto">
                <Button type="button" size="sm" variant="outline-secondary" onClick={newButtonHandler}>New</Button>
            </Col>
            <Col xs="auto">
                <SpinnerButton type="button" spinning={loading} onClick={onReloadList} size="sm">Reload</SpinnerButton>
            </Col>
        </Row>
    )
}

export default DLCodeFilter;
