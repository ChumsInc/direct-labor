import React from "react";
import {RoutingDetail, RoutingDetailTableField} from "./types";
import {SortableTable} from "chums-ducks";
import {routingDetailKey} from "./index";
import numeral from "numeral";

export interface RoutingDetailListProps {
    list: RoutingDetail[],
    tableKey: string,
    tfoot?: React.ReactElement<HTMLTableSectionElement>;
}

const detailTableFields:RoutingDetailTableField[] = [
    {field: 'RoutingNo', title: 'Routing No', sortable: true},
    {field: 'StepNo', title: 'Step', sortable: true},
    {field: 'StepDescription', title: 'Description', sortable: true},
    {field: 'WorkCenter', title: 'Sage W/C', sortable: true},
    {field: 'OperationCode', title: 'Sage Op Code', sortable: true},
    {field: 'OperationDescription', title: 'Operation Description', sortable: true},
    {field: 'ParentQtyFactor', title: 'Parent Qty', className: 'right'},
    {field: 'StdRatePiece', title: 'Std. Rate', sortable: true, className: 'right', render: (row:RoutingDetail) => numeral(row.StdRatePiece).format('0,0.0000')},
    {field: 'PlannedPieceCostDivisor', title: 'Qty Per Operation', className: 'right'},
];


const RoutingDetailList:React.FC<RoutingDetailListProps> = ({list, tableKey, tfoot}) => {

    return (
        <SortableTable tableKey={tableKey} keyField={routingDetailKey} size="xs" fields={detailTableFields}
                       data={list}
                       tfoot={tfoot} />
    )
}

export default RoutingDetailList;
