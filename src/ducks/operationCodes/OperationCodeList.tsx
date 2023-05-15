import React from "react";
import {SortableTable, SortableTableField, TablePagination} from "chums-components";
import {OperationCode} from "../types";
import {operationCodeKey} from "./utils";
import {useSelector} from "react-redux";
import {
    loadOperationCode,
    selectCurrentOperationCode,
    selectPage,
    selectRowsPerPage,
    selectSort,
    selectSortedList,
    setPage,
    setRowsPerPage,
    setSort
} from './index'
import numeral from "numeral";
import {useHistory} from "react-router-dom";
import {operationCodesOperationPath} from "../../routerPaths";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {SortProps} from "chums-types";

export interface OperationCodeListProps {
    tableKey: string,
}

const fields: SortableTableField<OperationCode>[] = [
    {field: 'WorkCenter', title: 'Work Center', sortable: true},
    {field: 'OperationCode', title: 'Operation Code', sortable: true},
    {field: 'OperationDescription', title: 'Description', sortable: true},
    {
        field: 'StdRatePiece',
        title: 'Std Rate',
        sortable: true,
        className: 'right',
        render: (row: OperationCode) => numeral(row.StdRatePiece).format('0,0.0000')
    },
    {field: 'PlannedPieceCostDivisor', title: 'Qty/Operation', sortable: true, className: 'right'},
]
const OperationCodeList: React.FC<OperationCodeListProps> = ({tableKey}) => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const list = useSelector(selectSortedList);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const sort = useAppSelector(selectSort);
    const selected = useSelector(selectCurrentOperationCode);

    const onSelectOperationCode = (oc: OperationCode) => {
        dispatch(loadOperationCode(oc));
        history.push(operationCodesOperationPath(oc.WorkCenter, oc.OperationCode));
    }

    const sortChangeHandler = (sort: SortProps) => dispatch(setSort(sort));
    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rpp: number) => dispatch(setRowsPerPage(rpp));

    return (
        <>
            <SortableTable keyField={operationCodeKey} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           size="xs" currentSort={sort} onChangeSort={sortChangeHandler}
                           onSelectRow={onSelectOperationCode} selected={operationCodeKey(selected)}/>
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             bsSize="sm"
                             showFirst showLast count={list.length}/>
        </>
    )
}
export default OperationCodeList;
