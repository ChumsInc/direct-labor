import React from "react";
import WorkCenterList from "./WorkCenterList";
import ErrorBoundary from "../../components/ErrorBoundary";
import {Outlet} from "react-router";
import DirectLaborRecalc from "../dlCodes/DirectLaborRecalc";

const WorkCenterPage = () => {
    return (
        <>
            <title>D/L Work Centers</title>
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
