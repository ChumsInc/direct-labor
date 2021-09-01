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
import numeral from "numeral";
import MultiLineField from "../../components/MultiLineField";
import {billOptionHeaderKey, BillOptionHeaderSorterProps} from "./types";
import {billOptionHeaderSelector} from "./index";
import {BillOptionHeaderTableField} from "../types";

export interface BillWhereUsedInOptionProps {
    tableKey: string,
    className?: string,
}

const detailTableFields: BillOptionHeaderTableField[] = [
    {field: 'BillNo', title: 'Bill No', sortable: true},
    {field: 'Revision', title: 'Revision', sortable: true},
    {field: 'BillOptionCategory', title: 'Option Category', sortable: true},
    {field: 'BillOption', title: 'Option', sortable: true},
    {
        field: 'OptionDesc1',
        title: 'Description',
        sortable: true,
        render: ({OptionDesc1, OptionDesc2}) => <MultiLineField line1={OptionDesc1} line2={OptionDesc2}/>
    },
    {
        field: 'DateLastUsed',
        title: 'Last Used',
        sortable: true,
        render: (row) => !!row.DateLastUsed ? new Date(row.DateLastUsed).toLocaleDateString() : 'N/A'
    },
    {field: 'WorkOrderStepNo', title: 'W/O Step No'},
    {field: 'OptionPrice', title: 'Option Price', render: row => numeral(row.OptionPrice).format('0,0.0000')},
    {
        field: 'DateUpdated',
        title: 'Date Updated',
        sortable: true,
        render: (row) => new Date(row.DateUpdated).toLocaleString()
    },
    {field: 'updatedByUser', title: 'Updated By'},
];

const BillOptionWhereUsed: React.FC<BillWhereUsedInOptionProps> = ({tableKey, className}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(tableAddedAction({key: tableKey, field: 'BillNo', ascending: true}));
        dispatch(addPageSetAction({key: tableKey, rowsPerPage: 10, current: 1}));
    }, [])

    const sort = useSelector(sortableTableSelector(tableKey));
    const list = useSelector(billOptionHeaderSelector(sort as BillOptionHeaderSorterProps));
    const pagedList = useSelector(pagedDataSelector(tableKey, list));
    if (!list.length) {
        return null;
    }

    return (
        <div className={classNames(className)}>
            <h4>Where Used In Bill Options</h4>
            <SortableTable tableKey={tableKey} keyField={billOptionHeaderKey} size="xs" fields={detailTableFields}
                           data={pagedList}/>
            {list.length > pagedList.length && (<PagerDuck pageKey={tableKey} dataLength={list.length}/>)}
        </div>
    )
}

export default BillOptionWhereUsed;
