import React, {useEffect} from "react";
import SelectedRoutingHeader from "./SelectedRoutingHeader";
import {selectCurrentLoading, selectCurrentRoutingNo} from "./selectors";
import {useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {setCurrentRouting} from "./actions";
import SelectedRoutingDetail from "./SelectedRoutingDetail";
import BillWhereUsed from "../billMaterials/BillWhereUsed";
import BillOptionWhereUsed from "../billMaterials/BillOptionWhereUsed";
import AnimatedLoadingBar from "../../components/AnimatedLoadingBar";
import DocumentTitle from "@/components/common/DocumentTitle";

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
            <DocumentTitle>{`D/L Routing: ${currentRoutingNo ?? ''}`}</DocumentTitle>
            <SelectedRoutingHeader/>
            <AnimatedLoadingBar loading={loading !== 'idle'}/>
            <SelectedRoutingDetail className="mt-3"/>
            <BillWhereUsed className="mt-3"/>
            <BillOptionWhereUsed className="mt-3"/>
        </div>
    )
}
export default RoutingInfo;
