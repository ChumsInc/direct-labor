import React from "react";
import RoutingList from "../ducks/routing/RoutingList";
import RoutingFilter from "../ducks/routing/RoutingFilter";
import ErrorBoundary from "./ErrorBoundary";
import {Helmet} from "react-helmet";
import {Outlet} from "react-router-dom";
import TemplatesFilter from "../ducks/templates/TemplatesFilter";
import TemplatesList from "../ducks/templates/TemplatesList";

const TemplatesPage = () => {
    return (
        <div className="row g-3">
            <Helmet>
                <title>W/T Templates</title>
            </Helmet>
            <div className="col-6">
                <TemplatesFilter/>
                <TemplatesList/>
            </div>
            <div className="col-6">
                <Outlet/>
            </div>
        </div>
    )
}
export default TemplatesPage;
