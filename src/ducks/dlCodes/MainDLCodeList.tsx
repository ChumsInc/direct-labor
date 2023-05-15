import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {
    selectCurrentHeader,
    selectLoaded,
    selectLoading,
    selectPage,
    selectRowsPerPage,
    selectSort,
    selectSortedList
} from "./selectors";
import {loadDLCode, loadDLCodes, setPage, setRowsPerPage, setSort} from "./actions";
import {DLCode} from "../types";
import DLCodeList from "./DLCodeList";
import {useHistory} from "react-router-dom";
import {dlCodePath} from "../../routerPaths";
import {useAppDispatch} from "../../app/configureStore";
import {TablePagination} from "chums-components";

export interface MainDLCodeListProps {
    tableKey: string,
}

const MainDLCodeList: React.FC<MainDLCodeListProps> = ({tableKey}) => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const loading = useSelector(selectLoading);
    const loaded = useSelector(selectLoaded);
    const selected = useSelector(selectCurrentHeader)
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const list = useSelector(selectSortedList);
    const sort = useSelector(selectSort);

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadDLCodes());
        }
    }, [])

    const onSelectDLCode = (code: DLCode) => {
        history.push(dlCodePath(code.id));
        dispatch(loadDLCode(code.id));
    }

    const pageChangeHandler = (page:number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rpp:number) => dispatch(setRowsPerPage(rpp));

    return (
        <div>
            <DLCodeList list={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                        sort={sort} onChangeSort={sort => dispatch(setSort(sort))}
                        selected={selected} onSelectDLCode={onSelectDLCode}/>
            <TablePagination  page={page} onChangePage={pageChangeHandler}
                              rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                              bsSize="sm" count={list.length} showFirst showLast />
        </div>

    )
}

export default MainDLCodeList;
