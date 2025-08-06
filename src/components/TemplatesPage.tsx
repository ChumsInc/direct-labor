import {Outlet} from "react-router";
import TemplatesFilter from "../ducks/templates/TemplatesFilter";
import TemplatesList from "../ducks/templates/TemplatesList";
import DocumentTitle from "@/components/common/DocumentTitle";

const TemplatesPage = () => {
    return (
        <div className="row g-5">
            <DocumentTitle>W/T Templates</DocumentTitle>
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
