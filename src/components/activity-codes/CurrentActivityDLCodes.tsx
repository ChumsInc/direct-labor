import React from 'react';
import {Link} from "react-router";
import {useAppSelector} from "@/app/configureStore";
import {selectCurrentActivityDLCodes} from "@/ducks/activity-codes/selectors";
import {DataTable, SortableTableField} from "@chumsinc/sortable-tables";
import {DLCode} from "chums-types";
import numeral from "numeral";
import NumericTableValue from "../NumericTableValue";
import classNames from "classnames";
import Decimal from "decimal.js";
import {dlCodePath} from "../../routerPaths";
import {dlCodeKey} from "@/ducks/dlCodes/utils";

const fields: SortableTableField<DLCode>[] = [
    {
        field: 'dlCode',
        title: 'D/L Code',
        sortable: true,
        render: (row) => <Link to={dlCodePath(row.id)}>{row.dlCode}</Link>
    },
    {field: 'description', title: 'Description', sortable: true},
    {
        field: 'standardAllowedMinutes',
        title: 'SAM',
        sortable: true,
        render: (row: DLCode) => <NumericTableValue value={row.standardAllowedMinutes} format="0,0.0000"/>
    },
    {field: 'workCenter', title: 'Work Center', sortable: true},
    {field: 'activityCode', title: 'Activity Code', sortable: true},
    {
        field: 'directLaborCost',
        title: 'D/L Cost',
        sortable: true,
        align: 'end',
        render: (row: DLCode) => <NumericTableValue value={row.laborBudget} format="$0,0.0000"/>
    },
    {
        field: 'fixedCosts',
        title: 'Fixed Costs',
        sortable: true,
        className: 'right',
        render: (row: DLCode) => <NumericTableValue value={row.fixedCosts} format="$0,0.000"/>
    },
    {
        field: 'StdRatePiece',
        title: 'Avg Sage Cost',
        sortable: true,
        align: 'end',
        className: (row: DLCode) => classNames({
            'text-danger': !new Decimal(row.directLaborCost ?? 0).toDecimalPlaces(4).eq(new Decimal(row.StdRatePiece ?? 0).toDecimalPlaces(4))
        }),
        render: (row: DLCode) => row.operationCode ? numeral(row.StdRatePiece).format('$0,0.0000') : null,
    },
]
const CurrentActivityDLCodes = () => {
    const dlCodes = useAppSelector(selectCurrentActivityDLCodes);

    const rowClassName = (row: DLCode) => {
        return classNames({
            'table-warning': !row.active
        })
    }

    return (
        <div>
            <h3>DL Codes</h3>
            <DataTable size="xs" fields={fields} data={dlCodes} keyField={dlCodeKey} rowClassName={rowClassName}/>
        </div>
    )
}

export default CurrentActivityDLCodes;
