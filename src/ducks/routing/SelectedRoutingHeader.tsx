import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentHeader} from "./selectors";
import numeral from "numeral";
import FormColumn from "@/components/common/FormColumn";

const SelectedRoutingHeader: React.FC = () => {
    const header = useSelector(selectCurrentHeader);

    if (!header) {
        return null;
    }

    return (
        <div>
            <FormColumn label="Routing">
                <h3>{header?.RoutingNo}</h3>
            </FormColumn>
            <FormColumn label="Description">
                <h3>{header?.StepDescription}</h3>
            </FormColumn>
            <hr/>
            <FormColumn label="Std. Rate">$ {numeral(header?.StandardRateTotal ?? 0).format('0,0.0000')}</FormColumn>
        </div>
    )

}

export default SelectedRoutingHeader;
