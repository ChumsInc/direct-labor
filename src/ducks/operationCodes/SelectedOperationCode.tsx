import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {loadedSelector, operationCodeSelector, selectedOCSelector, whereUsedSelector} from "./index";
import {Alert, FormColumn} from "chums-ducks";
import GLAccountElement from "../glAccounts/GLAccountElement";
import RoutingDetailList from "../routing/RoutingDetailList";
import {whereUsedDetailSelector} from "../routing";
import numeral from "numeral";
import {operationCodeKey} from "./types";
import {selectOperationCodeAction} from "./actions";
import {Helmet} from "react-helmet";
import {useAppDispatch} from "../../app/configureStore";

export interface SelectedOperationCodeProps {
    workCenter?: string,
    operationCode?: string
}

const SelectedOperationCode: React.FC<SelectedOperationCodeProps> = ({workCenter, operationCode}) => {
    const dispatch = useAppDispatch();
    const selected = useSelector(selectedOCSelector);
    const whereUsedKeys = useSelector(whereUsedSelector);
    const whereUsed = useSelector(whereUsedDetailSelector(whereUsedKeys));
    const navOperationCode = useSelector(operationCodeSelector(workCenter, operationCode));
    const loaded = useSelector(loadedSelector);

    useEffect(() => {
        if (navOperationCode && (!selected || operationCodeKey(selected) !== operationCodeKey(navOperationCode))) {
            dispatch(selectOperationCodeAction(navOperationCode));
        } else if (!operationCode) {
            dispatch(selectOperationCodeAction(null));
        }
    }, [loaded, workCenter, operationCode])

    if (!selected) {
        return (<Alert color="info">Select an Operation Code</Alert>)
    }
    const {
        WorkCenter,
        OperationCode,
        OperationDescription,
        StdRatePiece,
        PlannedPieceCostDivisor,
        FixedOvhdPercentOfCost,
        WipDirectAcct,
        WipFixOverhdAcct,
        WipVariableOvhdAcct,
        AppliedDirectAcct,
        AppliedFixedOvhdAcct
    } = selected;
    return (
        <div>
            <Helmet>
                <title>D/L OpCode: {WorkCenter}/{OperationCode}</title>
            </Helmet>
            <FormColumn label={"Work Center"}>
                <h3>{WorkCenter}</h3>
            </FormColumn>
            <FormColumn label={"Operation Code"}>
                <h3>{OperationCode}</h3>
            </FormColumn>
            <hr/>
            <FormColumn label="Description">
                {OperationDescription}
            </FormColumn>
            <FormColumn label="Std. Rate">
                {numeral(StdRatePiece).format('$ 0,0.0000')} / {PlannedPieceCostDivisor}
            </FormColumn>
            <FormColumn label="Fixed Overhead %">
                {numeral(FixedOvhdPercentOfCost / 100).format('0,0.0%')}
            </FormColumn>

            <hr/>
            <h4>GL Codes</h4>
            <FormColumn label="WIP Direct Account">
                <GLAccountElement accountKey={WipDirectAcct} showDescription/>
            </FormColumn>
            <FormColumn label="WIP Fixed Overhead">
                <GLAccountElement accountKey={WipFixOverhdAcct} showDescription/>
            </FormColumn>
            <FormColumn label="WIP Variable Overhead">
                <GLAccountElement accountKey={WipVariableOvhdAcct} showDescription/>
            </FormColumn>
            <FormColumn label="Applied Direct">
                <GLAccountElement accountKey={AppliedDirectAcct} showDescription/>
            </FormColumn>
            <FormColumn label="Applied Fixed Overhead">
                <GLAccountElement accountKey={AppliedFixedOvhdAcct} showDescription/>
            </FormColumn>
            <hr/>
            <h4>Where Used</h4>
            <RoutingDetailList list={whereUsed} tableKey="routing-detail-where-used"/>
        </div>
    )
}
export default SelectedOperationCode;
