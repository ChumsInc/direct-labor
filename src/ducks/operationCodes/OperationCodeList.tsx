import React, {useEffect} from "react";
import {
    addPageSetAction,
    pagedDataSelector,
    PagerDuck,
    SortableTable,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks";
import {OperationCode, OperationCodeTableField} from "../types";
import {operationCodeKey, OperationCodeSorterProps} from "./types";
import {useDispatch, useSelector} from "react-redux";
import {countRecordsSelector, filteredListSelector, selectedOCSelector} from './index'
import numeral from "numeral";
import {useHistory} from "react-router-dom";
import {operationCodesOperationPath} from "../../routerPaths";

export interface OperationCodeListProps {
    tableKey: string,
}

const fields: OperationCodeTableField[] = [
    {field: 'WorkCenter', title: 'Work Center', sortable: true},
    {field: 'OperationCode', title: 'Operation Code', sortable: true},
    {field: 'OperationDescription', title: 'Description', sortable: true},
    {
        field: 'StdRatePiece',
        title: 'Std Rate',
        sortable: true,
        className: 'right',
        render: (row: OperationCode) => numeral(row.StdRatePiece).format('0,0.0000')
    },
    {field: 'PlannedPieceCostDivisor', title: 'Qty/Operation', sortable: true, className: 'right'},
]
const OperationCodeList: React.FC<OperationCodeListProps> = ({tableKey}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        dispatch(addPageSetAction({key: tableKey}));
        dispatch(tableAddedAction({key: tableKey, field: 'WorkCenter', ascending: true}))
    }, [])
    const records = useSelector(countRecordsSelector);
    const sort = useSelector(sortableTableSelector(tableKey));
    const list = useSelector(filteredListSelector(sort as OperationCodeSorterProps));
    const pagedList = useSelector(pagedDataSelector(tableKey, list));
    const selected = useSelector(selectedOCSelector);

    const onSelectOperationCode = (oc: OperationCode) => {
        history.push(operationCodesOperationPath(oc.WorkCenter, oc.OperationCode));
    }

    return (
        <>
            <SortableTable tableKey={tableKey} keyField={operationCodeKey} fields={fields} data={pagedList} size="xs"
                           onSelectRow={onSelectOperationCode} selected={operationCodeKey(selected)}/>
            <PagerDuck pageKey={tableKey} dataLength={list.length} filtered={list.length !== records}/>
        </>
    )
}
export default OperationCodeList;
