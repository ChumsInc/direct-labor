import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {
    selectFilterInactive,
    selectStepsFilter,
    selectStepsLoading,
    selectWCFilter,
    setStepFilter,
    setStepWCFilter,
    toggleShowInactive
} from "./index";
import {WorkCenter} from "chums-types";
import {loadDLSteps} from "./actions";
import SearchInput from "../../components/SearchInput";
import {FormCheck, SpinnerButton} from "chums-components";
import {useAppDispatch} from "../../app/configureStore";
import {useNavigate} from "react-router-dom";

const DLCodeFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const filter = useSelector(selectStepsFilter);
    const wcFilter = useSelector(selectWCFilter);
    const loading = useSelector(selectStepsLoading);
    const filterInactive = useSelector(selectFilterInactive)

    const onSelectWC = (wc: WorkCenter | null) => dispatch(setStepWCFilter(wc?.workCenter ?? ''));
    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setStepFilter(ev.target.value ?? ''));
    const onReloadList = () => dispatch(loadDLSteps());

    const newButtonHandler = () => {
        navigate('/dl-steps/0');
    }

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col-auto">
                <WorkCenterSelect value={wcFilter} onSelectWorkCenter={onSelectWC}/>
            </div>
            <div className="col">
                <SearchInput onChange={onChangeSearch} value={filter}/>
            </div>
            <div className="col-auto">
                <FormCheck label="Show Inactive" checked={filterInactive}
                           onChange={(ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked))}
                           type="checkbox"/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-outline-secondary" onClick={newButtonHandler}>New</button>
            </div>
            <div className="col-auto">
                <SpinnerButton type="button" spinning={loading} onClick={onReloadList}>Reload</SpinnerButton>
            </div>
        </div>
    )
}

export default DLCodeFilter;
