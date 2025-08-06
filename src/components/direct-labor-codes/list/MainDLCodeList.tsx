import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {
    selectCurrentHeader,
    selectDLCodesStatus,
    selectLoaded,
    selectSort,
    selectSortedList
} from "@/ducks/dlCodes/selectors.ts";
import {loadDLCodes, setSort} from "@/ducks/dlCodes/actions.ts";
import type {DLCode} from "chums-types";
import {useNavigate} from "react-router";
import {dlCodePath} from "@/app/routerPaths.ts";
import {useAppDispatch} from "@/app/configureStore.ts";
import {SortableTable, TablePagination} from "@chumsinc/sortable-tables";
import AppErrorBoundary from "@/components/AppErrorBoundary.tsx";
import AnimatedLoadingBar from "../../AnimatedLoadingBar.tsx";
import {getPreference, localStorageKeys, setPreference} from "@/api/preferences.ts";
import {mainDLCodesFields} from "@/components/direct-labor-codes/list/mainDLCodeListFields.tsx";
import classNames from "classnames";

const MainDLCodeList = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const status = useSelector(selectDLCodesStatus);
    const loaded = useSelector(selectLoaded);
    const selected = useSelector(selectCurrentHeader)
    const list = useSelector(selectSortedList);
    const sort = useSelector(selectSort);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(getPreference<number>(localStorageKeys.dlCodesRowsPerPage, 25));

    useEffect(() => {
        if (!loaded && status === 'idle') {
            dispatch(loadDLCodes());
        }
    }, [dispatch, loaded, status])

    useEffect(() => {
        setPage(0);
    }, [list, sort]);

    const onSelectDLCode = (code: DLCode) => {
        navigate(dlCodePath(code.id));
    }

    const rowsPerPageChangeHandler = (rpp: number) => {
        setPreference<number>(localStorageKeys.dlCodesRowsPerPage, rpp);
        setPage(0);
        setRowsPerPage(rpp);
    }

    return (
        <AppErrorBoundary>
            <AnimatedLoadingBar loading={status === 'loading'}/>
            <SortableTable fields={mainDLCodesFields} keyField="id"
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           rowClassName={(row) => classNames({'table-warning': !row.active})}
                           currentSort={sort} onChangeSort={sort => dispatch(setSort(sort))}
                           selected={selected?.id} onSelectRow={onSelectDLCode}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                             size="sm" count={list.length} showFirst showLast/>
        </AppErrorBoundary>

    )
}

export default MainDLCodeList;
