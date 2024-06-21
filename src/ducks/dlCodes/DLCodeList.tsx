import React, {useState} from "react";
import {Link} from 'react-router-dom';
import {dlCodePath, operationCodesOperationPath} from "../../routerPaths";
import numeral from "numeral";
import {DLCode} from "chums-types";
import {SortableTable, SortableTableField, SortProps, TablePagination} from "chums-components";
import classNames from "classnames";
import NumericTableValue from "../../components/NumericTableValue";
import Decimal from "decimal.js";
import {DLCodeWorkTemplate} from "chums-types/src/direct-labor";

export interface DLCodeListProps {
    list: DLCode[];
    selected?: DLCode | null;
    sort: SortProps<DLCode>;
    onChangeSort: (props: SortProps<DLCode>) => void;
    onSelectDLCode?: (code: DLCode) => void,
}

const DLCodeTemplateList = ({templates}:{templates: DLCodeWorkTemplate[]}) => {
    return (
        <div>
            {}
        </div>
    )
}

const fields: SortableTableField<DLCode>[] = [
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
        render: (row: DLCode) => <NumericTableValue value={row.standardAllowedMinutes} format="0,0.0000"/>
    },
    {
        field: 'laborBudget',
        title: 'D/L Labor',
        sortable: true,
        className: 'right',
        render: (row: DLCode) => <NumericTableValue value={row.laborBudget} format="0,0.000" />
    },
    {
        field: 'fixedCosts',
        title: 'Fixed Costs',
        sortable: true,
        className: 'right',
        render: (row: DLCode) => <NumericTableValue value={row.fixedCosts} format="0,0.000" />
    },
    {
        field: 'directLaborCost',
        title: 'D/L Cost',
        sortable: true,
        className: 'right',
        render: (row: DLCode) => <NumericTableValue value={row.directLaborCost} format="$0,0.000" />
    },
    {field: 'workCenter', title: 'Work Center', className: 'center', sortable: true, render: (row) => row.workCenter ?? row.WOWorkCenter},
    {
        field: 'activityCode',
        title: 'Act. Code',
        sortable: true,
        render: (row: DLCode) => (
            <Link to={operationCodesOperationPath(row.workCenter, row.activityCode)}
                  onClick={(ev) => ev.stopPropagation()}>{row.activityCode ?? row.operationCode}</Link>
        )
    },
    {
        field: 'templates',
        title: 'Templates',
        sortable: true,
        align: 'end',
        render: (row: DLCode) => (row.templates ?? []).length
    },
    {
        field: 'StdRatePiece',
        title: 'Sage Cost',
        align: 'end',
        className: (row: DLCode) => classNames({
            'text-danger': !new Decimal(row.directLaborCost ?? 0).toDecimalPlaces(3).eq(new Decimal(row.StdRatePiece ?? 0).toDecimalPlaces(4))
        }),
        sortable: true,
        render: (row: DLCode) => row.operationCode ? numeral(row.StdRatePiece).format('$0,0.000') : null,
    },
]
const DLCodeList = ({list, selected, onSelectDLCode, onChangeSort, sort}: DLCodeListProps) => {
    return (
        <SortableTable keyField="id" fields={fields} data={list} size="xs"
                       rowClassName={(row: DLCode) => classNames({'table-warning': !row.active})}
                       currentSort={sort} onChangeSort={onChangeSort}
                       selected={selected?.id}
                       onSelectRow={onSelectDLCode}/>
    )
}

export default DLCodeList;
