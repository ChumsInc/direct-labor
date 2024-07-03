import React from "react";
import RoutingList from "./RoutingList";
import RoutingFilter from "./RoutingFilter";
import ErrorBoundary from "../../components/ErrorBoundary";
import {Helmet} from "react-helmet";
import {Link, Outlet} from "react-router-dom";
import {Alert} from "chums-components";

const RoutingPage = () => {
    return (
        <>
            <Helmet>
                <title>D/L Routing</title>
            </Helmet>
            <Alert color="danger"><strong>Note:</strong> These values are for reference only. For current values see <Link
                to="/templates">W/T Templates</Link></Alert>
            <div className="row g-5">
                <div className="col-4">
                    <RoutingFilter/>
                    <RoutingList/>
                </div>
                <div className="col-8">
                    <Outlet/>
                </div>
            </div>
        </>
)}
export default RoutingPage;
