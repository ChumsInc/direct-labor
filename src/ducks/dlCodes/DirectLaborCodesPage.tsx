import React from 'react';
import {Outlet} from "react-router";
import DLCodeFilter from "./DLCodeFilter";
import MainDLCodeList from "./MainDLCodeList";
import DocumentTitle from "@/components/common/DocumentTitle";

const DirectLaborCodesPage = () => {
    return (
        <>
            <DocumentTitle>D/L Codes</DocumentTitle>
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
