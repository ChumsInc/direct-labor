import React, {useEffect} from "react";
import {LoadingProgressBar, SortableTable, SortableTableField, TablePagination} from "chums-components";
import {useSelector} from "react-redux";
import {
    selectCurrentHeader,
    selectLoaded,
    selectLoading,
    selectPage,
    selectRowsPerPage,
    selectRoutingSort,
    selectSortedRoutingList,
} from "./selectors";
import {RoutingHeader} from "chums-types";
import numeral from "numeral";
import classNames from "classnames";
import {useNavigate} from "react-router-dom";
import {selectedRoutingPath} from "../../routerPaths";
import StatusBadge from "../../components/StatusBadge";
import {useAppDispatch} from "../../app/configureStore";
import {SortProps} from "chums-types";
import {loadRoutings, setCurrentRouting, setPage, setRowsPerPage, setSort} from "./actions";
import ErrorBoundary from "../../components/ErrorBoundary";


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
    }, []);

    const onSelect = (header: RoutingHeader) => {
        navigate(selectedRoutingPath(header.RoutingNo));
    }
    const onChangeSort = (sort: SortProps) => dispatch(setSort(sort));
    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (page: number) => dispatch(setRowsPerPage(page));

    return (
        <ErrorBoundary>
            {loading && <LoadingProgressBar striped animated style={{height: '5px'}} />}
            <SortableTable keyField={"RoutingNo"} size="xs" fields={routingListFields}
                           data={pagedList}
                           currentSort={sort} onChangeSort={onChangeSort}
                           selected={selectedHeader?.RoutingNo}
                           rowClassName={rowClassName}
                           onSelectRow={onSelect}/>
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             showFirst showLast bsSize="sm"
                             count={filteredList.length}/>
        </ErrorBoundary>
    )
}
export default RoutingList;
