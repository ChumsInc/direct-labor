import React from "react";
import SelectedRoutingHeader from "./SelectedRoutingHeader";
import SelectedRoutingDetail from "./SelectedRoutingDetail";
import BillWhereUsed from "../billMaterials/BillWhereUsed";
import BillOptionWhereUsed from "../billMaterials/BillOptionWhereUsed";

const SelectedRouting: React.FC = () => {
    return (
        <div>
            <SelectedRoutingHeader/>
            <SelectedRoutingDetail tableKey={'selected-routing-detail'} className="mt-3"/>
            <BillWhereUsed tableKey={'selected-routing-where-used'} className="mt-3"/>
            <BillOptionWhereUsed tableKey={'selected-routing-where-used-options'} className="mt-3"/>
        </div>
    )
}
export default SelectedRouting;
