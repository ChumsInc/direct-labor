import React, {useEffect} from "react";
import {
    addPageSetAction,
    SortableTable,
    SortableTableField,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks";
import {useSelector} from "react-redux";
import {
    selectedDetailSelector,
    RoutingDetailSorterProps,
    selectedLoadingSelector,
    RoutingDetailTableField, routingDetailKey
} from "./index";

export interface SelectedRoutingDetailProps {
    tableKey: string,
}

const detailTableFields:RoutingDetailTableField[] = [
    {field: 'StepNo', title: 'Step', sortable: true},
    {field: 'StepDescription', title: 'Description', sortable: true},
    {field: 'WorkCenter', title: 'Sage W/C', sortable: true},
    {field: 'OperationCode', title: 'Sage Op Code', sortable: true},
    {field: 'OperationDescription', title: 'Operation Description', sortable: true},
    {field: 'ParentQtyFactor', title: 'Parent Qty'},
    {field: 'StdRatePiece', title: 'Std. Rate', sortable: true},
    {field: 'PlannedPieceCostDivisor', title: 'Qty Per Operation'},
]
const SelectedRoutingDetail:React.FC<SelectedRoutingDetailProps> = ({tableKey}) => {
    useEffect(() => {
        tableAddedAction({key: tableKey, field: 'StepNo', ascending: true});
        addPageSetAction({key: tableKey, rowsPerPage: 25, current: 1});
    }, [])
    const sort = useSelector(sortableTableSelector(tableKey));
    const list = useSelector(selectedDetailSelector(sort as RoutingDetailSorterProps));
    return (
        <div>
            <h4>Routing Steps</h4>
            <SortableTable tableKey={tableKey} keyField={routingDetailKey} size="xs" fields={detailTableFields} data={list} />
        </div>
    )
}

export default SelectedRoutingDetail;
