import React, {useState} from "react";
import {SortableTable, SortableTableField} from "@chumsinc/sortable-tables";
import {useSelector} from "react-redux";

import classNames from "classnames";
import numeral from "numeral";
import MultiLineField from "../../components/MultiLineField";
import {billOptionHeaderKey, billOptionHeaderSorter, defaultBillOptionSort} from "./utils";
import {billOptionHeaderSelector} from "./selectors";
import {BillOptionHeader, SortProps} from "chums-types";

const detailTableFields: SortableTableField<BillOptionHeader>[] = [
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

const BillOptionWhereUsed = ({className}: { className?: string }) => {
    const list = useSelector(billOptionHeaderSelector);
    const [sort, setSort] = useState<SortProps<BillOptionHeader>>({...defaultBillOptionSort});
    if (!list.length) {
        return null;
    }

    return (
        <div className={classNames(className)}>
            <h4>Where Used In Bill Options</h4>
            <SortableTable keyField={billOptionHeaderKey} size="xs" fields={detailTableFields}
                           currentSort={sort} onChangeSort={(sort) => setSort(sort as SortProps<BillOptionHeader>)}
                           data={[...list].sort(billOptionHeaderSorter(sort))}/>
        </div>
    )
}

export default BillOptionWhereUsed;
