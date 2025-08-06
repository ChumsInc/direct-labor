import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectStepsWhereUsed} from "./index";
import {SortableTable, TablePagination} from "@chumsinc/sortable-tables";
import type {DLCode, SortProps} from "chums-types";
import {dlCodeSorter} from "../dlCodes/utils";
import {ErrorBoundary} from "react-error-boundary";
import {Alert} from "react-bootstrap";
import {secondaryDLCodesFields} from "@/components/direct-labor-codes/list/secondaryDLCodeListFields.tsx";

export default function WhereUsedDLCodeList() {
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
        <ErrorBoundary fallback={<Alert variant="danger">Oops, something went wrong.</Alert>}>
            <SortableTable data={sortedList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           fields={secondaryDLCodesFields} keyField="id"
                           currentSort={sort} onChangeSort={setSort}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: setRowsPerPage}}
                             count={list.length}/>
        </ErrorBoundary>

    )
}

