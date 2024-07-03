import React from 'react';
import StepsList from "../dlSteps/StepsList";
import {Outlet} from "react-router-dom";
import ActivityCodesList from "./ActivityCodesList";
import {Helmet} from "react-helmet";

const ActivityCodesPage = () => {
    return (
        <>
            <Helmet>
                <title>Activity Codes</title>
            </Helmet>
            <div className="row g-5">
                <div className="col-6">
                    <ActivityCodesList/>
                </div>
                <div className="col-6">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}

export default ActivityCodesPage;
