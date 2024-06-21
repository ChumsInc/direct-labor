import React, {useState} from "react";
import {useSelector} from "react-redux";

import classNames from "classnames";
import MultiLineField from "../../components/MultiLineField";
import {billHeaderKey, billHeaderSorter, defaultBillSort} from "./utils";
import {billHeaderSelector} from "./selectors";
import StatusBadge from "../../components/StatusBadge";
import {BillHeader, BillType, SortProps} from "chums-types";
import {SortableTable, SortableTableField, TablePagination} from "chums-components";
import {BillTypeDesc} from "../types";

const detailTableFields: SortableTableField<BillHeader>[] = [
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

const BillWhereUsed = ({className}: { className?: string }) => {
    const list = useSelector(billHeaderSelector);
    const [sort, setSort] = useState<SortProps<BillHeader>>({...defaultBillSort});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    if (!list.length) {
        return null;
    }
    return (
        <div className={classNames(className)}>
            <h4>Where Used</h4>
            <SortableTable keyField={billHeaderKey} size="xs" fields={detailTableFields}
                           currentSort={sort} onChangeSort={(sort) => setSort(sort as SortProps<BillHeader>)}
                           rowClassName={rowClassName}
                           data={[...list].sort(billHeaderSorter(sort)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={setRowsPerPage}
                             count={list.length} bsSize="sm"
                             showFirst={list.length > rowsPerPage * 2}
                             showLast={list.length > rowsPerPage * 2}/>
        </div>
    )
}

export default BillWhereUsed;
