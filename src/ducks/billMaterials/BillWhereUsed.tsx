import React, {useEffect} from "react";
import {
    addPageSetAction,
    pagedDataSelector,
    PagerDuck,
    SortableTable,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks";
import {useDispatch, useSelector} from "react-redux";

import classNames from "classnames";
import MultiLineField from "../../components/MultiLineField";
import {billHeaderKey, BillHeaderSorterProps} from "./types";
import {billHeaderSelector} from "./index";
import StatusBadge from "../../components/StatusBadge";
import {BillHeader, BillHeaderTableField, BillType, BillTypeDesc} from "../types";

export interface BillWhereUsedProps {
    tableKey: string,
    className?: string,
}

const detailTableFields: BillHeaderTableField[] = [
    {field: 'BillNo', title: 'Bill No', sortable: true},
    {field: 'Revision', title: 'Revision', sortable: true},
    {field: 'BillType', title: 'Bill Type', sortable: true, render: (row) => BillTypeDesc[row.BillType as BillType]},
    {
        field: 'BillDesc1',
        title: 'Description',
        sortable: true,
        render: ({BillDesc1, BillDesc2}) => <MultiLineField line1={BillDesc1} line2={BillDesc2}/>
    },
    {
        field: 'DateLastUsed',
        title: 'Last Used',
        sortable: true,
        render: (row) => !!row.DateLastUsed ? new Date(row.DateLastUsed).toLocaleDateString() : 'N/A'
    },
    {
        field: 'BillHasOptions',
        title: 'Has Options',
        render: (row) => <StatusBadge status={row.BillHasOptions === 'Y'} falseColor="secondary"/>
    },
    {
        field: 'DateUpdated',
        title: 'Date Updated',
        sortable: true,
        render: (row) => new Date(row.DateUpdated).toLocaleString()
    },
    {field: 'updatedByUser', title: 'Updated By'},
];

const rowClassName = (row: BillHeader) => classNames({
    'text-danger': row.BillType === 'I',
})

const BillWhereUsed: React.FC<BillWhereUsedProps> = ({tableKey, className}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(tableAddedAction({key: tableKey, field: 'BillNo', ascending: true}));
        dispatch(addPageSetAction({key: tableKey, rowsPerPage: 10, current: 1}));
    }, [])

    const sort = useSelector(sortableTableSelector(tableKey));
    const list = useSelector(billHeaderSelector(sort as BillHeaderSorterProps));
    const pagedList = useSelector(pagedDataSelector(tableKey, list));
    if (!list.length) {
        return null;
    }
    return (
        <div className={classNames(className)}>
            <h4>Where Used</h4>
            <SortableTable tableKey={tableKey} keyField={billHeaderKey} size="xs" fields={detailTableFields}
                           rowClassName={rowClassName}
                           data={pagedList}/>
            {list.length > pagedList.length && (<PagerDuck pageKey={tableKey} dataLength={list.length}/>)}
        </div>
    )
}

export default BillWhereUsed;
