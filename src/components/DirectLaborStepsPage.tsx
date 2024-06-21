import React from 'react';
import {Outlet} from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import StepsList from "../ducks/dlSteps/StepsList";

const DirectLaborStepsPage = () => {
    return (
        <div className="row g-3">
            <div className="col-6">
                <StepsList/>
            </div>
            <div className="col-6">
                <Outlet/>
            </div>
        </div>
    )
}

export default DirectLaborStepsPage;
