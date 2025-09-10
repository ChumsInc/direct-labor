import {type ChangeEvent, useId} from "react";
import {useSelector} from "react-redux";
import WorkCenterSelect from "@/ducks/workCenters/WorkCenterSelect.tsx";
import {
    selectShowInactive,
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
import {LocalStore} from "@chumsinc/ui-utils";
import {filterWorkCenterKey, showInactiveStepsKey} from "@/utils/preferences.ts";

const DLCodeFilter = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const filter = useSelector(selectStepsFilter);
    const wcFilter = useSelector(selectWCFilter);
    const loading = useSelector(selectStepsLoading);
    const showInactive = useSelector(selectShowInactive);
    const idShowInactive = useId();

    const onSelectWC = (wc: WorkCenter | null) => {
        LocalStore.setItem<string>(filterWorkCenterKey, wc?.workCenter ?? '');
        dispatch(setStepWCFilter(wc?.workCenter ?? ''));
    }
    const onChangeSearch = (search: string) => dispatch(setStepFilter(search));
    const onReloadList = () => dispatch(loadDLSteps());
    const onToggleShowInactive = (ev: ChangeEvent<HTMLInputElement>) => {
        LocalStore.setItem<boolean>(showInactiveStepsKey, ev.target.checked);
        dispatch(toggleShowInactive(ev.target.checked));
    }

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
                           checked={showInactive} onChange={onToggleShowInactive}
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
