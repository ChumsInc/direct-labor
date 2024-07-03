import React, {ChangeEvent, useEffect} from "react";
import {useSelector} from "react-redux";
import {loadOperationCodes, setSearch, setWorkCenter} from "./actions";
import {selectLoading, selectSearch, selectWorkCenter} from "./selectors";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {WorkCenter} from "chums-types";
import {currentOCWorkCenterKey, getPreference, setPreference} from "../../utils/preferences";
import SearchInput from "../../components/SearchInput";
import {useAppDispatch} from "../../app/configureStore";


const OperationCodeFilter = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const defaultWorkCenter = getPreference(currentOCWorkCenterKey, '');
        dispatch(setWorkCenter(defaultWorkCenter));
    }, [])


    const search = useSelector(selectSearch);
    const workCenterFilter = useSelector(selectWorkCenter);
    const loading = useSelector(selectLoading);

    const onSelectWorkCenter = (wc: WorkCenter | null) => {
        dispatch(setWorkCenter(wc?.workCenter ?? ''));
        setPreference(currentOCWorkCenterKey, wc?.workCenter ?? '');
    }

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value || ''));
    const onReload = () => dispatch(loadOperationCodes());


    return (
        <div className="row g-3 mb-3">
            <div className="col-auto">
                <WorkCenterSelect value={workCenterFilter} onSelectWorkCenter={onSelectWorkCenter}/>
            </div>
            <div className="col">
                <SearchInput value={search} onChange={onChangeSearch}/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-primary" onClick={onReload}>Reload</button>
            </div>
        </div>
    )
}

export default OperationCodeFilter;
