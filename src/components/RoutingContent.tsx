import React from "react";
import RoutingList from "../ducks/routing/RoutingList";
import SelectedRouting from "../ducks/routing/SelectedRouting";
import RoutingFilter from "../ducks/routing/RoutingFilter";
import {ErrorBoundary} from "react-error-boundary";
import {useParams} from "react-router-dom";
import {Helmet} from "react-helmet";

interface RoutingMatchProps {
    routingNo?: string,
}
const RoutingContent = () => {
    const {routingNo} = useParams<'routingNo'>();

    return (
        <div className="row g-3">
            <Helmet>
                <title>D/L Routing</title>
            </Helmet>
            <div className="col-4">
                <ErrorBoundary fallback={<div>Oops!</div>}>
                    <RoutingFilter />
                    <RoutingList />
                </ErrorBoundary>
            </div>
            <div className="col-8">
                <ErrorBoundary fallback={<div>Oh noes!</div>}>
                    <SelectedRouting routingNo={routingNo}/>
                </ErrorBoundary>
            </div>
        </div>
    )
}
export default RoutingContent;
