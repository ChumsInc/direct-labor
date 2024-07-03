import React from 'react';
import {Outlet} from "react-router-dom";
import StepsList from "./StepsList";
import DLStepsFilter from "./DLStepsFilter";
import {Helmet} from "react-helmet";

const DirectLaborStepsPage = () => {
    return (
        <>
            <Helmet>
                <title>D/L Steps</title>
            </Helmet>
            <div className="row g-3">
                <div className="col-6">
                    <DLStepsFilter/>
                    <StepsList/>
                </div>
                <div className="col-6">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}

export default DirectLaborStepsPage;
