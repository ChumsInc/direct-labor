import React, {useEffect} from "react";
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {addPageSetAction, pagedDataSelector, PagerDuck, SortableTable, tableAddedAction} from "chums-ducks";
import {defaultDLCodeSort} from "./types";
import {dlCodePath, operationCodesOperationPath} from "../../routerPaths";
import numeral from "numeral";
import {DLCode, DLCodeTableField} from "../types";

export interface DLCodeListProps {
    tableKey: string,
    list: DLCode[],
    selected?: DLCode,
    onSelectDLCode?: (code: DLCode) => void,
}

const fields: DLCodeTableField[] = [
    {
        field: "dlCode",
        title: 'D/L Code',
        sortable: true,
        render: (row: DLCode) => <Link to={dlCodePath(row.id)}>{row.dlCode}</Link>
    },
    {field: 'description', title: 'Description', sortable: true},
    {
        field: 'standardAllowedMinutes',
        title: 'SAM',
        className: 'right',
        sortable: true,
        render: (row: DLCode) => numeral(row.standardAllowedMinutes).format('0,0.0000')
    },
    {
        field: 'laborBudget',
        title: 'D/L Labor',
        sortable: true,
        className: 'right',
        render: (row: DLCode) => numeral(row.laborBudget).format('0,0.0000')
    },
    {
        field: 'fixedCosts',
        title: 'Fixed Costs',
        sortable: true,
        className: 'right',
        render: (row: DLCode) => numeral(row.fixedCosts).format('0,0.0000')
    },
    {
        field: 'directLaborCost',
        title: 'D/L Cost',
        sortable: true,
        className: 'right',
        render: (row: DLCode) => numeral(row.directLaborCost).format('$0,0.000')
    },
    {field: 'workCenter', title: 'Work Center', className: 'center', sortable: true},
    {
        field: 'operationCode',
        title: 'Op Code',
        sortable: true,
        render: (row: DLCode) => (
            <Link to={operationCodesOperationPath(row.workCenter, row.operationCode)}>{row.operationCode}</Link>)
    },
    {
        field: 'StdRatePiece',
        title: 'Sage Cost',
        className: (row: DLCode) => ({
            'right': true,
            'text-danger': Math.round(row.directLaborCost * 1000) !== Math.round(row.StdRatePiece * 1000)
        }),
        sortable: true,
        render: (row: DLCode) => numeral(row.StdRatePiece).format('$0,0.000')
    },
]
const DLCodeList: React.FC<DLCodeListProps> = ({tableKey, list, selected, onSelectDLCode}) => {
    const dispatch = useDispatch();
    const pagedList = useSelector(pagedDataSelector(tableKey, list));

    useEffect(() => {
        dispatch(addPageSetAction({key: tableKey}));
        dispatch(tableAddedAction({key: tableKey, ...defaultDLCodeSort}));
    }, [])

    return (
        <>
            <SortableTable tableKey={tableKey} keyField="id" fields={fields} data={pagedList} size="xs"
                           selected={selected?.id}
                           onSelectRow={onSelectDLCode}/>
            <PagerDuck dataLength={list.length} pageKey={tableKey}/>
        </>
    )
}

export default DLCodeList;
