import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {selectFilter, selectLoading, selectShowInactive, selectWorkCenterFilter} from "./selectors";
import {WorkCenter} from "../types";
import {loadDLCodes, setSearch, setWorkCenterFilter, toggleShowInactive} from "./actions";
import SearchInput from "../../components/SearchInput";
import {FormCheck, SpinnerButton} from "chums-ducks";
import {useAppDispatch} from "../../app/configureStore";

const DLCodeFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const filter = useSelector(selectFilter);
    const wcFilter = useSelector(selectWorkCenterFilter);
    const loading = useSelector(selectLoading);
    const showInactive = useSelector(selectShowInactive);

    const onSelectWC = (wc: WorkCenter | null) => dispatch(setWorkCenterFilter(wc?.WorkCenterCode || ''));
    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value || ''));
    const onReloadList = () => dispatch(loadDLCodes());

    return (
        <div className="row g-3">
            <div className="col-auto">
                <WorkCenterSelect value={wcFilter} onSelectWorkCenter={onSelectWC}/>
            </div>
            <div className="col-auto">
                <FormCheck label="Show Inactive" checked={showInactive}
                           onClick={() => dispatch(toggleShowInactive(!showInactive))} type="checkbox"/>
            </div>
            <div className="col-auto">
                <SearchInput onChange={onChangeSearch} value={filter} bsSize="sm"/>
            </div>
            <div className="col-auto">
                <SpinnerButton type="button" spinning={loading} onClick={onReloadList} size="sm">Reload</SpinnerButton>
            </div>
        </div>
    )
}

export default DLCodeFilter;
