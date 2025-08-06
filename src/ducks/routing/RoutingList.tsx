import {useEffect} from "react";
import {SortableTable, type SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import {useSelector} from "react-redux";
import {
    selectCurrentHeader,
    selectLoaded,
    selectLoading,
    selectPage,
    selectRoutingSort,
    selectRowsPerPage,
    selectSortedRoutingList,
} from "./selectors";
import type {RoutingHeader, SortProps} from "chums-types";
import numeral from "numeral";
import classNames from "classnames";
import {useNavigate} from "react-router";
import {selectedRoutingPath} from "@/app/routerPaths.ts";
import StatusBadge from "../../components/StatusBadge";
import {useAppDispatch} from "../../app/configureStore";
import {loadRoutings, setPage, setRowsPerPage, setSort} from "./actions";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import {ProgressBar} from "react-bootstrap";


const routingListFields: SortableTableField<RoutingHeader>[] = [
    {field: 'RoutingNo', title: 'Routing No', sortable: true},
    {field: 'StepDescription', title: 'Description', sortable: true},
    {
        field: 'StandardRateTotal',
        title: 'Std Rate',
        sortable: true,
        render: (row: RoutingHeader) => numeral(row.StandardRateTotal).format('0,0.0000')
    },
    {
        field: 'BillStatus',
        title: 'BOM Active',
        sortable: true,
        align: 'center',
        render: (row: RoutingHeader) => (<StatusBadge status={row.BillStatus} falseColor="danger"/>)
    },
    {
        field: 'ItemStatus',
        title: 'Item Active',
        sortable: true,
        align: 'center',
        render: (row: RoutingHeader) => (<StatusBadge status={row.ItemStatus} falseColor="danger"/>)
    },
];

const rowClassName = (row: RoutingHeader) => classNames({'text-danger': !(row.BillStatus && row.ItemStatus)});

const RoutingList = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loaded = useSelector(selectLoaded);
    const loading = useSelector(selectLoading);
    const selectedHeader = useSelector(selectCurrentHeader);
    const filteredList = useSelector(selectSortedRoutingList);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const sort = useSelector(selectRoutingSort);
    const pagedList = filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadRoutings());
        }
    }, [dispatch, loaded, loading]);

    const onSelect = (header: RoutingHeader) => {
        navigate(selectedRoutingPath(header.RoutingNo));
    }

    const onChangeSort = (sort: SortProps<RoutingHeader>) => {
        dispatch(setSort(sort));
    }

    const pageChangeHandler = (page: number) => {
        dispatch(setPage(page));
    }

    const rowsPerPageChangeHandler = (page: number) => {
        dispatch(setRowsPerPage(page));
    }

    return (
        <AppErrorBoundary>
            {loading && <ProgressBar striped animated now={100} style={{height: '5px'}}/>}
            <SortableTable keyField={"RoutingNo"} size="xs" fields={routingListFields}
                           data={pagedList}
                           currentSort={sort} onChangeSort={onChangeSort}
                           selected={selectedHeader?.RoutingNo}
                           rowClassName={rowClassName}
                           onSelectRow={onSelect}/>
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                             showFirst showLast size="sm"
                             count={filteredList.length}/>
        </AppErrorBoundary>
    )
}
export default RoutingList;
