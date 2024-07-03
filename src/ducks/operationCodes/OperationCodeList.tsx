import React, {useState} from "react";
import {SortableTable, SortableTableField, TablePagination} from "chums-components";
import {OperationCode, SortProps} from "chums-types";
import {operationCodeKey} from "./utils";
import {useSelector} from "react-redux";
import numeral from "numeral";
import {useNavigate} from "react-router-dom";
import {operationCodesOperationPath} from "../../routerPaths";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCurrentOperationCode, selectFilteredOpCodeList, selectLoading, selectSort} from "./selectors";
import {loadOperationCode, setSort} from "./actions";
import ErrorBoundary from "../../components/ErrorBoundary";
import AnimatedLoadingBar from "../../components/AnimatedLoadingBar";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";

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

const OperationCodeList = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const list = useSelector(selectFilteredOpCodeList);
    const sort = useAppSelector(selectSort);
    const selected = useSelector(selectCurrentOperationCode);
    const loading = useSelector(selectLoading)

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(getPreference<number>(localStorageKeys.dlCodesRowsPerPage, 15));

    const onSelectOperationCode = (oc: OperationCode) => {
        dispatch(loadOperationCode(oc));
        navigate(operationCodesOperationPath(oc.WorkCenter, oc.OperationCode));
    }

    const sortChangeHandler = (sort: SortProps) => dispatch(setSort(sort));
    const rowsPerPageChangeHandler = (rpp: number) => {
        setPreference<number>(localStorageKeys.dlCodesRowsPerPage, rpp);
        setRowsPerPage(rpp);
        setPage(0);
    }

    return (
        <ErrorBoundary>
            <AnimatedLoadingBar loading={loading}/>
            <SortableTable keyField={operationCodeKey} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           size="sm" currentSort={sort} onChangeSort={sortChangeHandler}
                           onSelectRow={onSelectOperationCode} selected={operationCodeKey(selected)}/>
            <TablePagination page={page} onChangePage={setPage} rowsPerPageOptions={[15, 25, 50, 100]}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             bsSize="sm"
                             showFirst showLast count={list.length}/>
        </ErrorBoundary>
    )
}
export default OperationCodeList;
