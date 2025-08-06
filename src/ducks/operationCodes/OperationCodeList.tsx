import {useState} from "react";
import {SortableTable, type SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import type {OperationCode, SortProps} from "chums-types";
import {operationCodeKey} from "./utils";
import {useSelector} from "react-redux";
import numeral from "numeral";
import {useNavigate} from "react-router";
import {operationCodesOperationPath} from "@/app/routerPaths.ts";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCurrentOperationCode, selectFilteredOpCodeList, selectLoading, selectSort} from "./selectors";
import {loadOperationCode, setSort} from "./actions";
import AppErrorBoundary from "@/components/AppErrorBoundary";
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

    const sortChangeHandler = (sort: SortProps<OperationCode>) => {
        dispatch(setSort(sort));
    }

    const rowsPerPageChangeHandler = (rpp: number) => {
        setPreference<number>(localStorageKeys.dlCodesRowsPerPage, rpp);
        setRowsPerPage(rpp);
        setPage(0);
    }

    return (
        <AppErrorBoundary>
            <AnimatedLoadingBar loading={loading}/>
            <SortableTable keyField={operationCodeKey} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           size="sm" currentSort={sort} onChangeSort={sortChangeHandler}
                           onSelectRow={onSelectOperationCode} selected={operationCodeKey(selected)}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPageProps={{pageValues: [15, 25, 50, 100], onChange: rowsPerPageChangeHandler}}
                             rowsPerPage={rowsPerPage}
                             size="sm"
                             showFirst showLast count={list.length}/>
        </AppErrorBoundary>
    )
}
export default OperationCodeList;
