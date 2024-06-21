import React from "react";
import {SortableTable, SortableTableField, TablePagination} from "chums-components";
import {OperationCode} from "chums-types";
import {operationCodeKey} from "./utils";
import {useSelector} from "react-redux";
import numeral from "numeral";
import {useNavigate} from "react-router-dom";
import {operationCodesOperationPath} from "../../routerPaths";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {SortProps} from "chums-types";
import {
    selectCurrentOperationCode,
    selectPage,
    selectRowsPerPage,
    selectSort,
    selectFilteredOpCodeList,
    selectLoading
} from "./selectors";
import {loadOperationCode, setPage, setRowsPerPage, setSort} from "./actions";
import ErrorBoundary from "../../components/ErrorBoundary";
import AnimatedLoadingBar from "../../components/AnimatedLoadingBar";

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
    const navigate = useNavigate();
    const list = useSelector(selectFilteredOpCodeList);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const sort = useAppSelector(selectSort);
    const selected = useSelector(selectCurrentOperationCode);
    const loading = useSelector(selectLoading)

    const onSelectOperationCode = (oc: OperationCode) => {
        dispatch(loadOperationCode(oc));
        navigate(operationCodesOperationPath(oc.WorkCenter, oc.OperationCode));
    }

    const sortChangeHandler = (sort: SortProps) => dispatch(setSort(sort));
    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rpp: number) => dispatch(setRowsPerPage(rpp));

    return (
        <ErrorBoundary>
            <AnimatedLoadingBar loading={loading} />
            <SortableTable keyField={operationCodeKey} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           size="xs" currentSort={sort} onChangeSort={sortChangeHandler}
                           onSelectRow={onSelectOperationCode} selected={operationCodeKey(selected)}/>
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             bsSize="sm"
                             showFirst showLast count={list.length}/>
        </ErrorBoundary>
    )
}
export default OperationCodeList;
