import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectStepsWhereUsed} from "./selectors";
import DLCodeList from "../dlCodes/DLCodeList";
import {TablePagination} from "chums-components";
import {DLCode, SortProps} from "chums-types";
import {dlCodeSorter} from "../dlCodes/utils";

const SelectedWhereUsedList = () => {
    const list = useSelector(selectStepsWhereUsed);
    const [sort, setSort] = useState<SortProps<DLCode>>({field: 'dlCode', ascending: true});
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [sortedList, setSortedList] = useState([...list].sort(dlCodeSorter(sort)))

    useEffect(() => {
        setPage(0);
        setSortedList([...list].sort(dlCodeSorter(sort)));
    }, [list, sort, rowsPerPage]);

    return (
        <>
            <DLCodeList list={sortedList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                        sort={sort} onChangeSort={setSort}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={setRowsPerPage}
                             count={list.length}/>
        </>

    )
}
export default SelectedWhereUsedList;
