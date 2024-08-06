import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentDLCodeTemplates, selectCurrentDLSageRate} from "./selectors";
import numeral from "numeral";
import {DLCodeWorkTemplate} from "chums-types";
import {useAppSelector} from "../../app/configureStore";
import classNames from "classnames";
import Decimal from "decimal.js";

const templateKey = (row: DLCodeWorkTemplate) => `${row.templateNo}:${row.workCenter}:${row.activityCode}`
export default function CurrentDLCodeTemplates() {
    const templates = useSelector(selectCurrentDLCodeTemplates);
    const rateProps = useAppSelector(selectCurrentDLSageRate);

    return (
        <table className="table table-xs">
            <caption>Expected Labor Scaling Quantity: {rateProps.scalingFactorLabor}</caption>
            <thead>
            <tr>
                <th>Template No</th>
                <th>Work Center</th>
                <th>Activity Code</th>
                <th className="text-end">Budget Labor Cost</th>
                <th className="text-end">Labor Scaling Quantity</th>
                <th className="text-end">Std Rate</th>
            </tr>
            </thead>
            <tbody>
            {templates.map((row) => (
                <tr key={templateKey(row)}>
                    <td>{row.templateNo}</td>
                    <td>{row.workCenter}</td>
                    <td>{row.activityCode}</td>
                    <td className={classNames("text-end", {'text-danger': !new Decimal(row.budgetLaborCost).eq(rateProps.averageHourlyRate)})}>{row.budgetLaborCost}</td>
                    <td className={classNames("text-end", {'text-danger': new Decimal(row.scalingFactorLabor).sub(rateProps.scalingFactorLabor ?? 0).abs().gt(0.01)})}>{row.scalingFactorLabor}</td>
                    <td className="text-end">{numeral(row.stdRate).format('0,0.0000')}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
