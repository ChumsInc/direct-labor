import React from 'react';
import AlertList from "../ducks/alerts/AlertList";
import MainNav from "./MainNav";
import {Outlet} from "react-router-dom";
import VersionInfo from "../ducks/version/VersionInfo";

const MainOutlet = () => {

    return (
        <div>
            <div className="row g-3">
                <div className="col-auto">
                    <MainNav />
                </div>
                <div className="col">
                    <AlertList />
                    <Outlet />
                </div>
            </div>
            <VersionInfo />
        </div>
    )
}

export default MainOutlet;
