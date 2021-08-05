import React, {ChangeEvent, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {filterWorkCenterSelector, loadingSelector, searchSelector} from "./index";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {WorkCenter} from "../workCenters/types";
import {filterChangedAction, loadOperationCodesAction, workCenterChangedAction} from "./actions";
import {Input, SpinnerButton} from "chums-ducks";
import {getPreference, setPreference} from "../../utils/preferences";
import {currentOCWorkCenterKey} from "../../utils/localStorageKeys";



const OperationCodeFilter: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const defaultWorkCenter = getPreference(currentOCWorkCenterKey, '');
        dispatch(workCenterChangedAction(defaultWorkCenter));
    }, [])

    const search = useSelector(searchSelector);
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
                <Input type="search" className="form-control form-control-sm" placeholder="Search"
                       value={search} onChange={onChangeSearch}/>
            </div>
            <div className="col-auto">
                <SpinnerButton size="sm" spinning={loading} onClick={onReload}>Reload</SpinnerButton>
            </div>
        </div>
    )
}

export default OperationCodeFilter;
