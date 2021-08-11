import React, {useEffect} from "react";
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {listSelector, loadedSelector, loadingSelector} from "./index";
import {loadDLCodesAction} from "./actions";
import {
    addPageSetAction,
    pagedDataSelector,
    PagerDuck,
    SortableTable,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks";
import {defaultDLCodeSort, DLCode, dlCodeKey, DLCodeSorterProps, DLCodeTableField} from "./types";
import {dlCodePath} from "../../routerPaths";
import numeral from "numeral";

export interface DLCodeListProps {
    tableKey: string,
}

const fields:DLCodeTableField[] = [
    {field: "dlCode", title: 'D/L Code', render: (row:DLCode) => <Link to={dlCodePath(row.dlCode)}>{row.dlCode}</Link>},
    {field: 'description', title: 'Description', sortable: true},
    {field: 'standardAllowedMinutes', title: 'SAM', className: 'right', sortable: true, render: (row:DLCode) => numeral(row.standardAllowedMinutes).format('0,0.0000')},
    {field: 'laborBudget', title: 'D/L Labor', sortable: true, className: 'right', render: (row:DLCode) => numeral(row.laborBudget).format('0,0.0000')},
    {field: 'fixedCosts', title: 'Fixed Costs', sortable: true, className: 'right', render: (row:DLCode) => numeral(row.fixedCosts).format('0,0.0000')},
    {field: 'directLaborCost', title: 'D/L Cost', sortable: true, className: 'right', render: (row:DLCode) => numeral(row.directLaborCost).format('0,0.0000')},
    {field: 'workCenter', title: 'Work Center', className: 'center', sortable: true},
    {field: 'operationCode', title: 'Op Code', sortable: true},
    {field: 'StdRatePiece', title: 'Sage Cost', className: 'right', sortable: true, render: (row:DLCode) => numeral(row.StdRatePiece).format('0,0.000')},
]
const DLCodeList:React.FC<DLCodeListProps> = ({tableKey}) => {
    const dispatch = useDispatch();
    const loading = useSelector(loadingSelector);
    const loaded = useSelector(loadedSelector);

    const sortProps = useSelector(sortableTableSelector(tableKey));
    const list = useSelector(listSelector(sortProps as DLCodeSorterProps));

    const pagedList = useSelector(pagedDataSelector(tableKey, list));

    useEffect(() => {
        dispatch(addPageSetAction({key: tableKey}));
        dispatch(tableAddedAction({key: tableKey,...defaultDLCodeSort}));
        if (!loaded && !loading) {
            dispatch(loadDLCodesAction());
        }
    }, [])

    return (
        <>
            <SortableTable tableKey={tableKey} keyField="id" fields={fields} data={pagedList} size="xs" />
            <PagerDuck dataLength={list.length} pageKey={tableKey} />
        </>
    )
}

export default DLCodeList;
