import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {selectFilter, selectShowInactive, selectWorkCenterFilter} from "./selectors";
import {WorkCenter} from "chums-types";
import {loadDLCodes, setSearch, setWorkCenterFilter, toggleShowInactive} from "./actions";
import SearchInput from "../../components/SearchInput";
import {FormCheck} from "chums-components";
import {useAppDispatch} from "../../app/configureStore";
import {useNavigate} from "react-router-dom";

const DLCodeFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const filter = useSelector(selectFilter);
    const wcFilter = useSelector(selectWorkCenterFilter);
    const navigate = useNavigate();
    const showInactive = useSelector(selectShowInactive);

    const onSelectWC = (wc: WorkCenter | null) => dispatch(setWorkCenterFilter(wc?.WorkCenterCode || ''));
    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value || ''));
    const onToggleShowInactive = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked));
    const onReloadList = () => dispatch(loadDLCodes());
    const newButtonHandler = () => navigate('/dl-codes/0');

    return (
        <div className="row g-3 mb-3 align-items-baseline">
            <div className="col-auto">
                <WorkCenterSelect value={wcFilter} onSelectWorkCenter={onSelectWC}/>
            </div>
            <div className="col">
                <SearchInput onChange={onChangeSearch} value={filter}/>
            </div>
            <div className="col-auto">
                <FormCheck label="Show Inactive" checked={showInactive} onChange={onToggleShowInactive}
                           type="checkbox"/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-outline-secondary" onClick={newButtonHandler}>New</button>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-primary" onClick={onReloadList}>Reload</button>
            </div>
        </div>
    )
}

export default DLCodeFilter;
