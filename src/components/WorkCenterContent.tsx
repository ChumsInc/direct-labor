import React from "react";
import WorkCenterList from "../ducks/workCenters/WorkCenterList";
import SelectedWorkCenter from "../ducks/workCenters/SelectedWorkCenter";
import {ErrorBoundary} from "chums-ducks";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";

interface WorkCenterMatchProps {
    workCenter?: string,
}

const WorkCenterContent: React.FC<RouteComponentProps> = ({match}) => {
    const {workCenter} = match.params as WorkCenterMatchProps;
    return (
        <div className="row g-3">
            <Helmet>
                <title>D/L Work Centers</title>
            </Helmet>
            <div className="col-8">
                <ErrorBoundary>
                    <WorkCenterList/>
                </ErrorBoundary>
            </div>
            <div className="col-4">
                <ErrorBoundary>
                    <SelectedWorkCenter workCenter={workCenter}/>
                </ErrorBoundary>
            </div>
        </div>
    )
}
export default WorkCenterContent;
