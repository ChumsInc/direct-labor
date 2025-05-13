import React from "react";
import RoutingList from "./RoutingList";
import RoutingFilter from "./RoutingFilter";
import {Link, Outlet} from "react-router";
import {Alert} from "react-bootstrap";
import DocumentTitle from "@/components/common/DocumentTitle";

const RoutingPage = () => {
    return (
        <>
            <DocumentTitle>D/L Routing</DocumentTitle>
            <Alert variant="danger">
                <strong>Note:</strong> These values are for reference only. For current values see
                <Link to="/templates" className="ms-1">W/T Templates</Link>
            </Alert>
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
    )
}
export default RoutingPage;
