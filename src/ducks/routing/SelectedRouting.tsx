import React, {useEffect} from "react";
import SelectedRoutingHeader from "./SelectedRoutingHeader";
import SelectedRoutingDetail from "./SelectedRoutingDetail";
import BillWhereUsed from "../billMaterials/BillWhereUsed";
import BillOptionWhereUsed from "../billMaterials/BillOptionWhereUsed";
import {useSelector} from "react-redux";
import {routingHeaderSelector, selectCurrentHeader, selectLoaded, setCurrentRouting} from "./index";
import {useHistory} from "react-router-dom";
import {routingPath} from "../../routerPaths";
import {Helmet} from "react-helmet";
import {Alert} from "chums-components";
import {useAppDispatch} from "../../app/configureStore";
import {routingHeaderKey} from "./utils";

export interface SelectedRoutingProps {
    routingNo?: string,
}

const SelectedRouting: React.FC<SelectedRoutingProps> = ({routingNo}) => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const selected = useSelector(selectCurrentHeader);
    const loaded = useSelector(selectLoaded);
    const navRouting = useSelector(routingHeaderSelector(routingNo || ''));

    useEffect(() => {
        if (loaded && !!navRouting && (!selected || routingHeaderKey(selected) !== routingHeaderKey(navRouting))) {
            dispatch(setCurrentRouting(navRouting));
        } else if (loaded && !navRouting && !!routingNo) {
            return history.replace(routingPath);
        }
    }, [routingNo, loaded])

    if (!selected) {
        return (<Alert color="info">Select a routing</Alert>);
    }

    return (
        <div>
            <Helmet>
                <title>D/L Routing: {selected?.RoutingNo || ''}</title>
            </Helmet>
            <SelectedRoutingHeader/>
            <SelectedRoutingDetail className="mt-3"/>
            <BillWhereUsed className="mt-3"/>
            <BillOptionWhereUsed className="mt-3"/>
        </div>
    )
}
export default SelectedRouting;
