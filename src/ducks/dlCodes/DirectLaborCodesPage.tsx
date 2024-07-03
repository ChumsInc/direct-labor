import React from 'react';
import {Outlet} from "react-router-dom";
import DLCodeFilter from "./DLCodeFilter";
import MainDLCodeList from "./MainDLCodeList";
import {Helmet} from "react-helmet";

const DirectLaborCodesPage = () => {
    return (
        <>
            <Helmet>
                <title>D/L Codes</title>
            </Helmet>
            <div className="row g-3">
                <div className="col-6">
                    <DLCodeFilter/>
                    <MainDLCodeList/>
                </div>
                <div className="col-6">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}

export default DirectLaborCodesPage;
