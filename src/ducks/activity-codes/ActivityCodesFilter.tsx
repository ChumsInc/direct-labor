import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import {useSelector} from "react-redux";
import {
    selectActivityCodesFilter,
    selectActivityCodesUnratedWCs,
    selectActivityCodesWithoutTemplates,
    selectActivityCodesWorkCenter
} from "./selectors";
import {
    loadActivityCodes,
    setActivityCodeSearch,
    setActivityCodesWorkCenter, toggleActivityCodesWOTemplates,
    toggleUnratedWorkCenters
} from "./actions";
import {FormCheck} from "chums-components";

const ActivityCodesFilter = () => {
    const dispatch = useAppDispatch();
    const workCenter = useSelector(selectActivityCodesWorkCenter);
    const unrated = useSelector(selectActivityCodesUnratedWCs);
    const search = useSelector(selectActivityCodesFilter);
    const showACWoTemplates = useAppSelector(selectActivityCodesWithoutTemplates);
    const cbId = useId();

    const wcChange = (ev:ChangeEvent<HTMLSelectElement>) => {
        dispatch(setActivityCodesWorkCenter(ev.target.value));
    }

    const onToggleUnrated = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleUnratedWorkCenters(ev.target.checked));
    }

    const onToggleWithoutAC = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleActivityCodesWOTemplates(ev.target.checked));
    }

    const searchChangeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(setActivityCodeSearch(ev.target.value));
    }

    const reloadHandler = () => {
        dispatch(loadActivityCodes());
    }

    return (
        <div>
            <div className="row g-3 align-items-baseline">
                <div className="col">
                    <input type="search" className="form-control" value={search} placeholder="Search"
                           onChange={searchChangeHandler}/>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-outline-primary" onClick={reloadHandler}>Reload</button>
                </div>
            </div>
            <div className="row g-3 align-items-baseline">
                <div className="col-auto">
                    <WorkCenterSelect value={workCenter} includeUnrated={unrated} onChange={wcChange} />
                </div>
                <div className="col-auto">
                    <FormCheck type="checkbox" checked={unrated} onChange={onToggleUnrated}
                               disabled={workCenter !== ''} label="Show Inactive W/C" />
                </div>
                <div className="col-auto">
                    <FormCheck type="checkbox" checked={showACWoTemplates} onChange={onToggleWithoutAC}
                               label="Show Activity Codes w/o Templates" />
                </div>
            </div>
        </div>
    )
}

export default ActivityCodesFilter;
