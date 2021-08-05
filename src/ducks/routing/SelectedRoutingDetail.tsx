import React, {useEffect} from "react";
import {addPageSetAction, sortableTableSelector, tableAddedAction} from "chums-ducks";
import {useSelector} from "react-redux";
import {RoutingDetailSorterProps, selectedDetailSelector} from "./index";
import classNames from "classnames";
import numeral from "numeral";
import RoutingDetailList from "./RoutingDetailList";

export interface SelectedRoutingDetailProps {
    tableKey: string,
    className?: string,
}

interface SelectedRoutingTotalProps {
    total: number,
}

const SelectedRoutingTotal: React.FC<SelectedRoutingTotalProps> = ({total}) => {
    return (
        <tfoot>
        <tr>
            <th colSpan={6}>Total</th>
            <th className="right">$ {numeral(total).format('0,0.0000')}</th>
            <th/>
        </tr>
        </tfoot>
    )
}

const SelectedRoutingDetail: React.FC<SelectedRoutingDetailProps> = ({tableKey, className}) => {
    useEffect(() => {
        tableAddedAction({key: tableKey, field: 'StepNo', ascending: true});
        addPageSetAction({key: tableKey, rowsPerPage: 25, current: 1});
    }, [])
    const sort = useSelector(sortableTableSelector(tableKey));
    const list = useSelector(selectedDetailSelector(sort as RoutingDetailSorterProps));
    const total = list.reduce((value, row) => value + ((row.StdRatePiece * row.ParentQtyFactor) / (row.PlannedPieceCostDivisor || 1)), 0)
    const tfoot = (<SelectedRoutingTotal total={total}/>);

    if (!list.length) {
        return null;
    }

    return (
        <div className={classNames(className)}>
            <h4>Routing Steps</h4>
            <RoutingDetailList list={list} tableKey={tableKey} tfoot={tfoot}/>
        </div>
    )
}

export default SelectedRoutingDetail;
