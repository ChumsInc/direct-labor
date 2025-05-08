import React from 'react';
import {Outlet} from "react-router";
import DLCodeFilter from "./DLCodeFilter";
import MainDLCodeList from "./MainDLCodeList";

const DirectLaborCodesPage = () => {
    return (
        <>
            <title>D/L Codes</title>
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
