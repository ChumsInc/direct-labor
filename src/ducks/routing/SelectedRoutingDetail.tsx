import React from "react";
import {selectCurrentDetail} from "./selectors";
import classNames from "classnames";
import numeral from "numeral";
import RoutingDetailList from "./RoutingDetailList";
import {useAppSelector} from "../../app/configureStore";
import Decimal from "decimal.js";

export interface SelectedRoutingDetailProps {
    className?: string,
}

interface SelectedRoutingTotalProps {
    total: number | string,
}

const SelectedRoutingTotal = ({total}:SelectedRoutingTotalProps) => {
    return (
        <tfoot>
        <tr>
            <th colSpan={7}>Total</th>
            <th className="text-end">$ {numeral(total).format('0,0.0000')}</th>
            <td/>
        </tr>
        </tfoot>
    )
}

const SelectedRoutingDetail = ({className}: SelectedRoutingDetailProps) => {
    const list = useAppSelector(selectCurrentDetail);
    const total = list.reduce((value, row) => value.add(new Decimal(row.StdRatePiece).times(row.ParentQtyFactor).div(row.PlannedPieceCostDivisor ?? 1)), new Decimal(0)).toString();
    const tfoot = (<SelectedRoutingTotal total={total}/>);

    if (!list.length) {
        return null;
    }

    return (
        <div className={classNames(className)}>
            <h4>Routing Steps</h4>
            <RoutingDetailList list={list} tfoot={tfoot}/>
        </div>
    )
}

export default SelectedRoutingDetail;
