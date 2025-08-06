import {Outlet} from "react-router";
import ActivityCodesList from "./ActivityCodesList";
import DocumentTitle from "@/components/common/DocumentTitle";

const ActivityCodesPage = () => {
    return (
        <>
            <DocumentTitle>Activity Codes</DocumentTitle>
            <div className="row g-5">
                <div className="col-6">
                    <ActivityCodesList/>
                </div>
                <div className="col-6">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}

export default ActivityCodesPage;
