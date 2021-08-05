import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadedSelector} from "../ducks/routing";
import {loadWorkCentersAction} from "../ducks/workCenters/actions";
import WorkCenterList from "../ducks/workCenters/WorkCenterList";
import SelectedWorkCenter from "../ducks/workCenters/SelectedWorkCenter";
import {ErrorBoundary} from "chums-ducks";

const WorkCenterContent:React.FC = () => {
    const dispatch = useDispatch();
    const loaded = useSelector(loadedSelector);
    useEffect(() => {
        if (!loaded) {
            dispatch(loadWorkCentersAction());
        }
    }, [])
    return (
        <div className="row g-3">
            <div className="col-8">
                <ErrorBoundary>
                    <WorkCenterList />
                </ErrorBoundary>
            </div>
            <div className="col-4">
                <ErrorBoundary>
                    <SelectedWorkCenter />
                </ErrorBoundary>
            </div>
        </div>
    )
}
export default WorkCenterContent;
