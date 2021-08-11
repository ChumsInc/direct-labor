import React, {useEffect} from "react";
import SelectedRoutingHeader from "./SelectedRoutingHeader";
import SelectedRoutingDetail from "./SelectedRoutingDetail";
import BillWhereUsed from "../billMaterials/BillWhereUsed";
import BillOptionWhereUsed from "../billMaterials/BillOptionWhereUsed";
import {useDispatch, useSelector} from "react-redux";
import {
    loadedSelector,
    loadingSelector,
    routingHeaderKey,
    routingHeaderSelector,
    selectedHeaderSelector,
    selectedSelector
} from "./index";
import {selectRoutingAction} from "./actions";
import {useHistory} from "react-router-dom";
import {routingPath} from "../../routerPaths";
import {Helmet} from "react-helmet";
import {Alert} from "chums-ducks";

export interface SelectedRoutingProps {
    routingNo?:string,
}
const SelectedRouting: React.FC<SelectedRoutingProps> = ({routingNo}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const selected = useSelector(selectedHeaderSelector);
    const loaded = useSelector(loadedSelector);
    const navRouting = useSelector(routingHeaderSelector(routingNo || ''));

    useEffect(() => {
        if (loaded && !!navRouting && (!selected || routingHeaderKey(selected) !== routingHeaderKey(navRouting))) {
            dispatch(selectRoutingAction(navRouting));
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
            <SelectedRoutingDetail tableKey={'selected-routing-detail'} className="mt-3"/>
            <BillWhereUsed tableKey={'selected-routing-where-used'} className="mt-3"/>
            <BillOptionWhereUsed tableKey={'selected-routing-where-used-options'} className="mt-3"/>
        </div>
    )
}
export default SelectedRouting;
