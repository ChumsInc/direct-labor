import React from "react";
import RoutingList from "../ducks/routing/RoutingList";
import SelectedRouting from "../ducks/routing/SelectedRouting";
import RoutingFilter from "../ducks/routing/RoutingFilter";
import {ErrorBoundary} from "chums-ducks";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";

interface RoutingMatchProps {
    routingNo?: string,
}
const RoutingContent:React.FC<RouteComponentProps> = ({match}) => {
    const {routingNo} = match.params as RoutingMatchProps;

    return (
        <div className="row g-3">
            <Helmet>
                <title>D/L Routing</title>
            </Helmet>
            <div className="col-4">
                <ErrorBoundary>
                    <RoutingFilter />
                    <RoutingList />
                </ErrorBoundary>
            </div>
            <div className="col-8">
                <ErrorBoundary>
                    <SelectedRouting routingNo={routingNo}/>
                </ErrorBoundary>
            </div>
        </div>
    )
}
export default RoutingContent;
