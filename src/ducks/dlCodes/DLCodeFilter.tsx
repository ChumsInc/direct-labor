import React, {ChangeEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {filterInactiveSelector, filterSelector, loadingSelector, wcFilterSelector} from "./selectors";
import {WorkCenter} from "../types";
import {filterInactiveAction, loadDLCodesAction, setDLCodeFilterAction, setWCFilterAction} from "./actions";
import SearchInput from "../../components/SearchInput";
import {FormCheck, SpinnerButton} from "chums-ducks";

const DLCodeFilter: React.FC = () => {
    const dispatch = useDispatch();
    const filter = useSelector(filterSelector);
    const wcFilter = useSelector(wcFilterSelector);
    const loading = useSelector(loadingSelector);
    const filterInactive = useSelector(filterInactiveSelector);

    const onSelectWC = (wc: WorkCenter | null) => dispatch(setWCFilterAction(wc?.WorkCenterCode || ''));
    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setDLCodeFilterAction(ev.target.value || ''));
    const onReloadList = () => dispatch(loadDLCodesAction());

    return (
        <div className="row g-3">
            <div className="col-auto">
                <WorkCenterSelect value={wcFilter} onSelectWorkCenter={onSelectWC}/>
            </div>
            <div className="col-auto">
                <FormCheck label="Hide Inactive" checked={filterInactive}
                           onClick={() => dispatch(filterInactiveAction(!filterInactive))} type="checkbox"/>
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
