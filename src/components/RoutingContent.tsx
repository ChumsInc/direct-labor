import React from "react";
import RoutingList from "../ducks/routing/RoutingList";
import SelectedRouting from "../ducks/routing/SelectedRouting";
import RoutingFilter from "../ducks/routing/RoutingFilter";
import {ErrorBoundary} from "chums-ducks";

const RoutingContent:React.FC = () => {

    return (
        <div className="row g-3">
            <div className="col-4">
                <ErrorBoundary>
                    <RoutingFilter />
                    <RoutingList />
                </ErrorBoundary>
            </div>
            <div className="col-8">
                <ErrorBoundary>
                    <SelectedRouting />
                </ErrorBoundary>
            </div>
        </div>
    )
}
export default RoutingContent;
