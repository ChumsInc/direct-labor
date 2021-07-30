import React, {useEffect} from "react";
import {
    addPageSetAction,
    pagedDataSelector,
    PagerDuck,
    SortableTable,
    SortableTableField,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks";
import {useDispatch, useSelector} from "react-redux";
import {
    filteredlistSelector,
    listSelector,
    loadedSelector,
    loadingSelector,
    RoutingHeaderSorterProps,
    selectedHeaderSelector
} from "./index";
import {RoutingHeader} from "./types";
import numeral from "numeral";
import {fetchRoutingsAction, selectRoutingAction} from "./actions";

const tableId = 'routing-list'

const routingListFields: SortableTableField[] = [
    {field: 'RoutingNo', title: 'Routing No', sortable: true},
    {field: 'StepDescription', title: 'Description', sortable: true},
    {
        field: 'StandardRateTotal',
        title: 'Std Rate',
        sortable: true,
        render: (row: RoutingHeader) => numeral(row.StandardRateTotal).format('0,0.0000')
    }
];

const RoutingList: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(tableAddedAction({key: tableId, field: 'RoutingNo', ascending: true}));
        dispatch(addPageSetAction({key: tableId, rowsPerPage: 25, current: 1}))
    }, []);
    const loaded = useSelector(loadedSelector);
    const loading = useSelector(loadingSelector);
    const selectedHeader = useSelector(selectedHeaderSelector);
    const sort = useSelector(sortableTableSelector(tableId));

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(fetchRoutingsAction());
        }
    }, []);
    const onSelect = (header: RoutingHeader) => dispatch(selectRoutingAction(header));

    const list = useSelector(listSelector(sort as RoutingHeaderSorterProps));
    const filteredList = useSelector(filteredlistSelector(sort as RoutingHeaderSorterProps));
    const pagedList = useSelector(pagedDataSelector(tableId, filteredList));
    return (
        <>
            <SortableTable tableKey={tableId} keyField={"RoutingNo"} size="xs" fields={routingListFields} data={pagedList}
                           selected={selectedHeader?.RoutingNo}
                           onSelectRow={onSelect}/>
            <PagerDuck pageKey={tableId} dataLength={filteredList.length}
                       filtered={list.length !== filteredList.length}/>
        </>
    )
}
export default RoutingList;
