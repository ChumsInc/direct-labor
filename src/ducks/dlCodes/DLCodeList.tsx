import React from "react";
import {Link} from 'react-router-dom';
import {dlCodePath} from "../../routerPaths";
import numeral from "numeral";
import {DLCode, DLCodeWorkTemplate} from "chums-types";
import {SortableTable, SortableTableField, SortProps} from "chums-components";
import classNames from "classnames";
import NumericTableValue from "../../components/NumericTableValue";
import Decimal from "decimal.js";
import {activityCodePath} from "../activity-codes/utils";

export interface DLCodeListProps {
    list: DLCode[];
    selected?: DLCode | null;
    sort: SortProps<DLCode>;
    onChangeSort: (props: SortProps<DLCode>) => void;
    onSelectDLCode?: (code: DLCode) => void,
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
        field: 'directLaborCost',
        title: 'D/L Cost',
        sortable: true,
        className: 'right',
        render: (row: DLCode) => <NumericTableValue value={row.directLaborCost} format="$0,0.000"/>
    },
    {
        field: 'workCenter',
        title: 'Work Center',
        className: 'center',
        sortable: true,
        render: (row) => row.workCenter ?? row.WOWorkCenter
    },
    {
        field: 'activityCode',
        title: 'Act. Code',
        sortable: true,
        render: (row: DLCode) => (
            <Link to={activityCodePath({WorkCenter: row.workCenter, ActivityCode: row.activityCode})}
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
            'text-danger': new Decimal(row.directLaborCost ?? 0).sub(row.StdRatePiece ?? 0).abs().gte(0.001),
        }),
        sortable: true,
        render: (row: DLCode) => row.operationCode ? numeral(row.StdRatePiece).format('$0,0.000') : null,
    },
]
const DLCodeList = ({list, selected, onSelectDLCode, onChangeSort, sort}: DLCodeListProps) => {
    return (
        <SortableTable keyField="id" fields={fields} data={list} size="sm"
                       rowClassName={(row: DLCode) => classNames({'table-warning': !row.active})}
                       currentSort={sort} onChangeSort={onChangeSort}
                       selected={selected?.id}
                       onSelectRow={onSelectDLCode}/>
    )
}

export default DLCodeList;
