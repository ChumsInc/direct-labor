import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentHeader} from "./index";
import {Alert, FormColumn} from "chums-components";
import numeral from "numeral";

const SelectedRoutingHeader: React.FC = () => {
    const header = useSelector(selectCurrentHeader);
    if (!header) {
        return (<Alert color="info">Select a routing</Alert>);
    }
    return (
        <div>
            <FormColumn label="Routing">
                <h3>{header.RoutingNo}</h3>
            </FormColumn>
            <FormColumn label="Description">
                <h3>{header.StepDescription}</h3>
            </FormColumn>
            <hr/>
            <FormColumn label="Std. Rate">$ {numeral(header.StandardRateTotal).format('0,0.0000')}</FormColumn>
        </div>
    )

}

export default SelectedRoutingHeader;
