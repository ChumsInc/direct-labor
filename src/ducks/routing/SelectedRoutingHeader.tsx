import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectedHeaderSelector, selectedLoadingSelector} from "./index";
import {Alert, FormColumn, SpinnerButton} from "chums-ducks";
import numeral from "numeral";
import {fetchRoutingAction} from "./actions";

const SelectedRoutingHeader:React.FC = () => {
    const dispatch = useDispatch()
    const header = useSelector(selectedHeaderSelector);
    const loading = useSelector(selectedLoadingSelector);
    if (!header) {
        return (<Alert color="info">Select a routing</Alert>);
    }
    return (
        <div>
            <h3>
                <FormColumn label={header.RoutingNo}>
                    <div>{header.StepDescription}</div>
                </FormColumn>
            </h3>
            <FormColumn label="Std. Rate">{numeral(header.StandardRateTotal).format('0,0.0000')}</FormColumn>
            <FormColumn label="">
                <SpinnerButton type="button" size="sm" spinning={loading}
                               onClick={() => dispatch(fetchRoutingAction(header))}>
                    Reload
                </SpinnerButton>
            </FormColumn>
        </div>
    )

}

export default SelectedRoutingHeader;
