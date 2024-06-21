import React from "react";
import RoutingList from "../ducks/routing/RoutingList";
import RoutingFilter from "../ducks/routing/RoutingFilter";
import ErrorBoundary from "./ErrorBoundary";
import {Helmet} from "react-helmet";
import {Outlet} from "react-router-dom";

const RoutingPage = () => {
    return (
        <div className="row g-3">
            <Helmet>
                <title>D/L Routing</title>
            </Helmet>
            <div className="col-4">
                <RoutingFilter/>
                <RoutingList/>
            </div>
            <div className="col-8">
                <Outlet/>
            </div>
        </div>
    )
}
export default RoutingPage;
