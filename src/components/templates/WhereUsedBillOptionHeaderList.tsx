import React, {useEffect, useState} from 'react';
import {SortableTable, SortableTableField, TablePagination, TablePaginationProps} from "@chumsinc/sortable-tables";
import {TemplateBillOptionHeader} from "@/ducks/types";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {
    selectFilteredTemplateBillOptionHeaders,
    selectSort,
    setSort
} from "@/ducks/where-used/wuBillOptionHeadersSlice";
import {SortProps} from "chums-types";
import classNames from "classnames";
import {billOptionKey} from "@/ducks/where-used/utils";

const formatDate = (value: string | null) => {
    if (!value || !dayjs(value).isValid()) {
        return 'N/A'
    }
    return dayjs(value).format('MM/DD/YYYY');
}

const fields: SortableTableField<TemplateBillOptionHeader>[] = [
    {field: 'BillNo', title: "Bill Option No", sortable: true},
    {field: "Options", title: 'Options', render: (row) => (
        <div>
            {row.Options.map(row => <div key={billOptionKey(row)}>
                <strong className="me-3">{billOptionKey(row)}</strong>
                <span>{row.OptionDesc1}</span>
                {!!row.OptionDesc2 && <span className="ms-3">{row.OptionDesc2}</span>}
            </div>)}
        </div>
        )
    },
    // {
    //     field: 'BillDesc1', title: 'Description', sortable: true,
    //     render: (row) => (
    //         <>
    //             <div>{row.OptionDesc1}</div>
    //             {!!row.OptionDesc2 && <div>{row.OptionDesc2}</div>}
    //         </>
    //     )
    // },
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

const rowClassName = (row: TemplateBillOptionHeader) => {
    return classNames({
        'table-danger': row.ProductType === 'D',
        'table-warning': row.ProductType !== 'D' && row.InactiveItem === 'Y'
    })
}
export default function WhereUsedBillOptionHeaderList({
                                                    rowsPerPage,
                                                    rowsPerPageProps
                                                }: Pick<TablePaginationProps, 'rowsPerPage' | 'rowsPerPageProps'>) {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectFilteredTemplateBillOptionHeaders);
    const sort = useAppSelector(selectSort);
    const [page, setPage] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [rowsPerPageProps, list.length]);

    const sortChangeHandler = (sort: SortProps<TemplateBillOptionHeader>) => {
        dispatch(setSort(sort));
    }

    return (
        <div>
            <h4>Option Bills</h4>
            <SortableTable<TemplateBillOptionHeader>
                fields={fields} size="xs"
                keyField="BillNo"
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
