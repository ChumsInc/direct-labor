import React from 'react';
import {Outlet} from "react-router";
import ActivityCodesList from "./ActivityCodesList";

const ActivityCodesPage = () => {
    return (
        <>
            <title>Activity Codes</title>
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
