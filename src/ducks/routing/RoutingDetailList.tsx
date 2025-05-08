import React, {useEffect} from "react";
import {RoutingDetail} from "chums-types";
import {Link} from 'react-router';
import {selectLoaded, selectLoading} from "./selectors";
import numeral from "numeral";
import {operationCodesOperationPath, selectedRoutingPath, selectedWorkCenterPath} from "../../routerPaths";
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {routingDetailKey} from "./utils";
import {DataTable, SortableTableField} from "@chumsinc/sortable-tables";
import {loadRoutings} from "./actions";

export interface RoutingDetailListProps {
    list: RoutingDetail[],
    tfoot?: React.ReactElement<HTMLTableSectionElement>;
}

const detailTableFields: SortableTableField<RoutingDetail>[] = [
    {
        field: 'RoutingNo',
        title: 'Routing No',
        sortable: true,
        render: ({RoutingNo}: RoutingDetail) => (<Link to={selectedRoutingPath(RoutingNo)}>{RoutingNo}</Link>)
    },
    {field: 'StepNo', title: 'Step', sortable: true},
    {field: 'StepDescription', title: 'Description', sortable: true},
    {
        field: 'WorkCenter',
        title: 'Sage W/C',
        sortable: true,
        render: (row: RoutingDetail) => <Link to={selectedWorkCenterPath(row.WorkCenter)}>{row.WorkCenter}</Link>
    },
    {
        field: 'OperationCode',
        title: 'Sage Op Code',
        sortable: true,
        render: ({WorkCenter, OperationCode}: RoutingDetail) => (
            <Link to={operationCodesOperationPath(WorkCenter, OperationCode)}>{OperationCode}</Link>
        )
    },
    {field: 'OperationDescription', title: 'Operation Description', sortable: true},
    {field: 'ParentQtyFactor', title: 'Parent Qty', className: 'right'},
    {
        field: 'StdRatePiece',
        title: 'Std. Rate',
        sortable: true,
        className: 'right',
        render: (row: RoutingDetail) => numeral(row.StdRatePiece).format('0,0.0000')
    },
    {field: 'PlannedPieceCostDivisor', title: 'Qty Per Operation', className: 'right'},
];


const RoutingDetailList = ({list, tfoot}: RoutingDetailListProps) => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectLoaded);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadRoutings());
        }
    }, [loaded, loading])

    return (
        <DataTable keyField={routingDetailKey} size="xs" fields={detailTableFields}
                   data={list}
                   tfoot={tfoot}/>
    )
}

export default RoutingDetailList;
