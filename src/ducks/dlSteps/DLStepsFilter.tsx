import React, {ChangeEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {filterSelector, loadingSelector, wcFilterSelector} from "./selectors";
import {WorkCenter} from "../types";
import {loadDLStepsAction, setDLStepFilterAction, setWCFilterAction} from "./actions";
import SearchInput from "../../components/SearchInput";
import {SpinnerButton} from "chums-ducks";

const DLCodeFilter:React.FC = () => {
    const dispatch = useDispatch();
    const filter = useSelector(filterSelector);
    const wcFilter = useSelector(wcFilterSelector);
    const loading = useSelector(loadingSelector);

    const onSelectWC = (wc:WorkCenter|null) => dispatch(setWCFilterAction(wc?.WorkCenterCode || ''));
    const onChangeSearch = (ev:ChangeEvent<HTMLInputElement>) => dispatch(setDLStepFilterAction(ev.target.value || ''));
    const onReloadList = () => dispatch(loadDLStepsAction());

    return (
        <div className="row g-3">
            <div className="col-auto">
                <WorkCenterSelect value={wcFilter} onSelectWorkCenter={onSelectWC}/>
            </div>
            <div className="col-auto">
                <SearchInput onChange={onChangeSearch} value={filter} bsSize="sm" />
            </div>
            <div className="col-auto">
                <SpinnerButton type="button" spinning={loading} onClick={onReloadList} size="sm">Reload</SpinnerButton>
            </div>
        </div>
    )
}

export default DLCodeFilter;
