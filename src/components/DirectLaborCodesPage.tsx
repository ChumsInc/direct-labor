import React from 'react';
import {Outlet} from "react-router-dom";
import DLCodeFilter from "../ducks/dlCodes/DLCodeFilter";
import MainDLCodeList from "../ducks/dlCodes/MainDLCodeList";

const DirectLaborCodesPage = () => {
    return (
        <div className="row g-3">
            <div className="col-6">
                <DLCodeFilter/>
                <MainDLCodeList />
            </div>
            <div className="col-6">
                <Outlet/>
            </div>
        </div>
    )
}

export default DirectLaborCodesPage;
