import React from "react";
import RoutingList from "../ducks/routing/RoutingList";
import SelectedRouting from "../ducks/routing/SelectedRouting";
import RoutingFilter from "../ducks/routing/RoutingFilter";

const RoutingContent:React.FC = () => {

    return (
        <div className="row g-3">
            <div className="col-6">
                <RoutingFilter />
                <RoutingList />
            </div>
            <div className="col-6">
                <SelectedRouting />
            </div>
        </div>
    )
}
export default RoutingContent;
