import React from "react";
import WorkCenterList from "../ducks/workCenters/WorkCenterList";
import SelectedWorkCenter from "../ducks/workCenters/SelectedWorkCenter";
import {ErrorBoundary} from "react-error-boundary";
import {useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useAppDispatch} from "../app/configureStore";
import DirectLaborRecalc from "../ducks/dlCodes/DirectLaborRecalc";

interface WorkCenterMatchProps {
    workCenter?: string,
}

const WorkCenterContent = () => {
    const dispatch = useAppDispatch();
    const {workCenter} = useParams<'workCenter'>()

    return (
        <div className="row g-3">
            <Helmet>
                <title>D/L Work Centers</title>
            </Helmet>
            <div className="col-8">
                <ErrorBoundary fallback={<div>Something went wrong in WorkCenterList.</div>}>
                    <WorkCenterList/>
                </ErrorBoundary>
            </div>
            <div className="col-4">
                <ErrorBoundary fallback={<div>Something failed in SelectedWorkCenter.</div>}>
                    <SelectedWorkCenter workCenter={workCenter}/>
                </ErrorBoundary>
                <DirectLaborRecalc/>
            </div>
        </div>
    )
}
export default WorkCenterContent;
