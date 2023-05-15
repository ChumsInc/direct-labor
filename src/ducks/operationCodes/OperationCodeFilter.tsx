import React, {ChangeEvent, useEffect} from "react";
import {useSelector} from "react-redux";
import {loadOperationCodes, selectLoading, selectSearch, selectWorkCenter, setSearch, setWorkCenter} from "./index";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {WorkCenter} from "../types";
import {SpinnerButton} from "chums-ducks";
import {currentOCWorkCenterKey, getPreference, setPreference} from "../../utils/preferences";
import SearchInput from "../../components/SearchInput";
import {useAppDispatch} from "../../app/configureStore";


const OperationCodeFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const defaultWorkCenter = getPreference(currentOCWorkCenterKey, '');
        dispatch(setWorkCenter(defaultWorkCenter));
    }, [])


    const search = useSelector(selectSearch);
    const workCenterFilter = useSelector(selectWorkCenter);
    const loading = useSelector(selectLoading);

    const onSelectWorkCenter = (wc: WorkCenter | null) => {
        dispatch(setWorkCenter(wc?.WorkCenterCode || ''));
        setPreference(currentOCWorkCenterKey, wc?.WorkCenterCode || '');
    }

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value || ''));
    const onReload = () => dispatch(loadOperationCodes());


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
