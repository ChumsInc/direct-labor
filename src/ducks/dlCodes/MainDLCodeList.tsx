import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentHeader, selectDLCodesStatus, selectLoaded, selectSort, selectSortedList} from "./selectors";
import {loadDLCodes, setSort} from "./actions";
import type {DLCode} from "chums-types";
import DLCodeList from "./DLCodeList";
import {useNavigate} from "react-router";
import {dlCodePath} from "@/app/routerPaths.ts";
import {useAppDispatch} from "@/app/configureStore";
import {TablePagination} from "@chumsinc/sortable-tables";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import AnimatedLoadingBar from "../../components/AnimatedLoadingBar";
import {getPreference, localStorageKeys, setPreference} from "@/api/preferences";

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
    }, [])

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
            <DLCodeList list={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                        sort={sort} onChangeSort={sort => dispatch(setSort(sort))}
                        selected={selected} onSelectDLCode={onSelectDLCode}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                             size="sm" count={list.length} showFirst showLast/>
        </AppErrorBoundary>

    )
}

export default MainDLCodeList;
