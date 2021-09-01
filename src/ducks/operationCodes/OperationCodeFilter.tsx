import React, {ChangeEvent, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {filterSelector, filterWorkCenterSelector, loadingSelector} from "./index";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {WorkCenter} from "../types";
import {filterChangedAction, loadOperationCodesAction, workCenterChangedAction} from "./actions";
import {SpinnerButton} from "chums-ducks";
import {currentOCWorkCenterKey, getPreference, setPreference} from "../../utils/preferences";
import SearchInput from "../../components/SearchInput";


const OperationCodeFilter: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const defaultWorkCenter = getPreference(currentOCWorkCenterKey, '');
        dispatch(workCenterChangedAction(defaultWorkCenter));
    }, [])


    const search = useSelector(filterSelector);
    const workCenterFilter = useSelector(filterWorkCenterSelector);
    const loading = useSelector(loadingSelector);

    const onSelectWorkCenter = (wc: WorkCenter | null) => {
        dispatch(workCenterChangedAction(wc?.WorkCenterCode || ''));
        setPreference(currentOCWorkCenterKey, wc?.WorkCenterCode || '');
    }

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(filterChangedAction(ev.target.value || ''));
    const onReload = () => dispatch(loadOperationCodesAction());


    return (
        <div className="row g-3">
            <div className="col-auto">
                <WorkCenterSelect value={workCenterFilter} onSelectWorkCenter={onSelectWorkCenter} bsSize="sm"/>
            </div>
            <div className="col-auto">
                <SearchInput value={search} onChange={onChangeSearch} bsSize="sm"/>
            </div>
            <div className="col-auto">
                <SpinnerButton size="sm" spinning={loading} onClick={onReload}>Reload</SpinnerButton>
            </div>
        </div>
    )
}

export default OperationCodeFilter;
