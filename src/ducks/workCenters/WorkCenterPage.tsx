import React from "react";
import WorkCenterList from "./WorkCenterList";
import ErrorBoundary from "../../components/ErrorBoundary";
import {Outlet} from "react-router-dom";
import {Helmet} from "react-helmet";
import DirectLaborRecalc from "../dlCodes/DirectLaborRecalc";

const WorkCenterPage = () => {
    return (
        <>
            <Helmet>
                <title>D/L Work Centers</title>
            </Helmet>
            <div className="row g-3">
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
        </>
    )
}
export default WorkCenterPage;
