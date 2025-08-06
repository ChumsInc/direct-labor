import {Outlet} from "react-router";
import DLCodeFilter from "./DLCodeFilter";
import MainDLCodeList from "./MainDLCodeList";
import DocumentTitle from "@/components/common/DocumentTitle";

const DirectLaborCodesPage = () => {
    return (
        <div data-component="DirectLaborCodesPage">
            <DocumentTitle>D/L Activity Codes</DocumentTitle>
            <div className="row g-5">
                <div className="col-6">
                    <DLCodeFilter/>
                    <MainDLCodeList/>
                </div>
                <div className="col-6">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default DirectLaborCodesPage;
