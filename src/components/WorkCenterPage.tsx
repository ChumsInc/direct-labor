import React from "react";
import WorkCenterList from "../ducks/workCenters/WorkCenterList";
import ErrorBoundary from "./ErrorBoundary";
import {Outlet} from "react-router-dom";
import {Helmet} from "react-helmet";
import DirectLaborRecalc from "../ducks/dlCodes/DirectLaborRecalc";

const WorkCenterPage = () => {
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
                <Outlet/>
                <DirectLaborRecalc/>
            </div>
        </div>
    )
}
export default WorkCenterPage;
