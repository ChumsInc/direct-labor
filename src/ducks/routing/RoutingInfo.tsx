import React, {useEffect} from "react";
import SelectedRoutingHeader from "./SelectedRoutingHeader";
import {selectCurrentLoading, selectCurrentRoutingNo} from "./selectors";
import {useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {setCurrentRouting} from "./actions";
import SelectedRoutingDetail from "./SelectedRoutingDetail";
import BillWhereUsed from "../billMaterials/BillWhereUsed";
import BillOptionWhereUsed from "../billMaterials/BillOptionWhereUsed";
import AnimatedLoadingBar from "../../components/AnimatedLoadingBar";

const RoutingInfo = () => {
    const dispatch = useAppDispatch();
    const {routingNo} = useParams();
    const currentRoutingNo = useAppSelector(selectCurrentRoutingNo);
    const loading = useAppSelector(selectCurrentLoading);

    useEffect(() => {
        if (routingNo && routingNo !== currentRoutingNo) {
            dispatch(setCurrentRouting(routingNo));
        }
    }, [routingNo]);

    return (
        <div>
            <Helmet>
                <title>D/L Routing: {currentRoutingNo || ''}</title>
            </Helmet>
            <SelectedRoutingHeader/>
            <AnimatedLoadingBar loading={loading !== 'idle'}/>
            <SelectedRoutingDetail className="mt-3"/>
            <BillWhereUsed className="mt-3"/>
            <BillOptionWhereUsed className="mt-3"/>
        </div>
    )
}
export default RoutingInfo;
