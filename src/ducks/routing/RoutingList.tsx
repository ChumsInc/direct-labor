import React, {useEffect} from "react";
import {SortableTable, SortableTableField, TablePagination} from "chums-components";
import {useSelector} from "react-redux";
import {
    loadRoutings,
    selectCurrentHeader,
    selectLoaded,
    selectLoading,
    selectPage,
    selectRowsPerPage,
    selectSort,
    selectSortedRoutingList,
    setCurrentRouting,
    setPage,
    setRowsPerPage,
    setSort
} from "./index";
import {RoutingHeader} from "../types";
import numeral from "numeral";
import classNames from "classnames";
import {useHistory} from "react-router-dom";
import {selectedRoutingPath} from "../../routerPaths";
import StatusBadge from "../../components/StatusBadge";
import {useAppDispatch} from "../../app/configureStore";
import {SortProps} from "chums-types";


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
        render: (row: RoutingHeader) => (<StatusBadge status={row.BillStatus} falseColor="danger"/>)
    },
    {
        field: 'ItemStatus',
        title: 'Item Active',
        sortable: true,
        render: (row: RoutingHeader) => (<StatusBadge status={row.ItemStatus} falseColor="danger"/>)
    },
];

const rowClassName = (row: RoutingHeader) => classNames({'text-danger': !(row.BillStatus && row.ItemStatus)});

const RoutingList = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const loaded = useSelector(selectLoaded);
    const loading = useSelector(selectLoading);
    const selectedHeader = useSelector(selectCurrentHeader);
    const filteredList = useSelector(selectSortedRoutingList);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const sort = useSelector(selectSort);
    const pagedList = filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadRoutings());
        }
    }, []);

    const onSelect = (header: RoutingHeader) => {
        dispatch(setCurrentRouting(header));
        history.push(selectedRoutingPath(header.RoutingNo));
    }
    const onChangeSort = (sort: SortProps) => dispatch(setSort(sort));
    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (page: number) => dispatch(setRowsPerPage(page));

    return (
        <>
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
        </>
    )
}
export default RoutingList;
