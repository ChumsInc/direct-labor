import React from "react";
import {useSelector} from "react-redux";
import {selectedSelector} from "./index";
import SelectedRoutingHeader from "./SelectedRoutingHeader";
import SelectedRoutingDetail from "./SelectedRoutingDetail";

const SelectedRouting:React.FC = () => {
    const {header, detail, whereUsed, loading} = useSelector(selectedSelector);
    return (
        <div>
            <SelectedRoutingHeader />
            <SelectedRoutingDetail tableKey={'selected-routing-detail'} />
        </div>
    )
}
export default SelectedRouting;
