import React, {useEffect} from "react";
import {
    addPageSetAction,
    pagedDataSelector,
    PagerDuck,
    SortableTable,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks";
import {OperationCode, operationCodeKey, OperationCodeSorterProps, OperationCodeTableField} from "./types";
import {useDispatch, useSelector} from "react-redux";
import {countRecordsSelector, listSelector, loadedSelector, loadingSelector, selectedOCSelector} from './index'
import numeral from "numeral";
import {selectOperationCodeAction} from "./actions";

export interface OperationCodeListProps {
    tableKey: string,
}

const fields: OperationCodeTableField[] = [
    {field: 'WorkCenter', title: 'Work Center', sortable: true},
    {field: 'OperationCode', title: 'Operation Code', sortable: true},
    {field: 'OperationDescription', title: 'Description', sortable: true},
    {field: 'StdRatePiece', title: 'Std Rate', sortable: true, className: 'right', render: (row:OperationCode) => numeral(row.StdRatePiece).format('0,0.0000')},
    {field: 'PlannedPieceCostDivisor', title: 'Qty/Operation', sortable: true, className: 'right'},
]
const OperationCodeList: React.FC<OperationCodeListProps> = ({tableKey}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(addPageSetAction({key: tableKey}));
        dispatch(tableAddedAction({key: tableKey, field: 'WorkCenter', ascending: true}))
    }, [])
    const records = useSelector(countRecordsSelector);
    const sort = useSelector(sortableTableSelector(tableKey));
    const list = useSelector(listSelector(sort as OperationCodeSorterProps));
    const pagedList = useSelector(pagedDataSelector(tableKey, list));
    const selected = useSelector(selectedOCSelector);

    const onSelectOperationCode = (oc:OperationCode) => dispatch(selectOperationCodeAction(oc));
    return (
        <>
            <SortableTable tableKey={tableKey} keyField={operationCodeKey} fields={fields} data={pagedList} size="xs"
                           onSelectRow={onSelectOperationCode} selected={operationCodeKey(selected)}/>
            <PagerDuck pageKey={tableKey} dataLength={list.length} filtered={list.length !== records} />
        </>
    )
}
export default OperationCodeList;
