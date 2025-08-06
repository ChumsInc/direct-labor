import {useEffect, useState} from 'react';
import {SortableTable, type SortableTableField, TablePagination, type TablePaginationProps} from "@chumsinc/sortable-tables";
import type {TemplateBillHeader} from "@/ducks/types";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectBillHeadersSort, selectFilteredTemplateBillHeaders, setSort} from "@/ducks/where-used/wuBillHeadersSlice";
import type {SortProps} from "chums-types";
import classNames from "classnames";
import {templateBillHeaderKey} from "@/ducks/where-used/utils";

const formatDate = (value:string|null) => {
    if (!value || !dayjs(value).isValid()) {
        return 'N/A'
    }
    return dayjs(value).format('MM/DD/YYYY');
}

const fields: SortableTableField<TemplateBillHeader>[] = [
    {field: 'BillNo', title: "Bill No", sortable: true},
    {field: 'Revision', title: 'Revision', sortable: true},
    {field: 'BillType', title: 'BillType', sortable: true},
    {
        field: 'BillDesc1', title: 'Description', sortable: true,
        render: (row) => (
            <>
                <div>{row.BillDesc1}</div>
                {!!row.BillDesc2 && <div>{row.BillDesc2}</div>}
            </>
        )
    },
    {field: 'ProductType', title: 'Product Type', align: 'center'},
    {field: 'InactiveItem', title: 'Inactive', align: 'center'},
    {
        field: 'DateLastUsed',
        title: 'Last Used',
        sortable: true,
        render: (row) => formatDate(row.DateLastUsed),
        align: 'end'
    },
    {
        field: 'DateUpdated',
        title: 'Updated',
        sortable: true,
        render: (row) => formatDate(row.DateUpdated),
        align: 'end'
    },
];

const rowClassName = (row:TemplateBillHeader) => {
    return classNames({
        'table-danger': row.ProductType === 'D',
        'table-warning': row.ProductType !== 'D' && row.InactiveItem === 'Y'
    })
}
export default function WhereUsedBillHeaderList({
                                                    rowsPerPage,
                                                    rowsPerPageProps
                                                }: Pick<TablePaginationProps, 'rowsPerPage' | 'rowsPerPageProps'>) {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectFilteredTemplateBillHeaders);
    const sort = useAppSelector(selectBillHeadersSort);
    const [page, setPage] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [rowsPerPageProps, list.length]);

    const sortChangeHandler = (sort: SortProps<TemplateBillHeader>) => {
        dispatch(setSort(sort));
    }

    return (
        <div>
            <h4>Bills</h4>
            <SortableTable fields={fields} size="xs" keyField={templateBillHeaderKey}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           rowClassName={rowClassName}
                           currentSort={sort} onChangeSort={sortChangeHandler}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage}
                             count={list.length}
                             showFirst showLast/>
        </div>

    )
}
