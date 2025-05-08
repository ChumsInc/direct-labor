import React from "react";
import {Outlet} from "react-router";
import TemplatesFilter from "../ducks/templates/TemplatesFilter";
import TemplatesList from "../ducks/templates/TemplatesList";

const TemplatesPage = () => {
    return (
        <div className="row g-3">
            <title>W/T Templates</title>
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
