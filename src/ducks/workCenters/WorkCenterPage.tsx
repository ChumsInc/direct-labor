import React from "react";
import WorkCenterList from "./WorkCenterList";
import ErrorBoundary from "../../components/ErrorBoundary";
import {Outlet} from "react-router";
import DirectLaborRecalc from "../dlCodes/DirectLaborRecalc";
import DocumentTitle from "@/components/common/DocumentTitle";

const WorkCenterPage = () => {
    return (
        <>
            <DocumentTitle>D/L Work Centers</DocumentTitle>
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
