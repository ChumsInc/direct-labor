import type {SortableTableField} from "@chumsinc/sortable-tables";
import type {DLCode} from "chums-types";
import {Link} from "react-router";
import {dlCodePath} from "@/app/routerPaths";
import NumericTableValue from "@/components/NumericTableValue";
import {activityCodePath} from "@/ducks/activity-codes/utils";
import classNames from "classnames";
import Decimal from "decimal.js";
import numeral from "numeral";

export const dlCodesFields: SortableTableField<DLCode>[] = [
    {
        field: 'workCenter',
        title: 'Work Center',
        className: 'center',
        sortable: true,
        render: (row) => row.workCenter ?? row.WOWorkCenter
    },
    {
        field: 'activityCode',
        title: 'W/T Act. Code',
        sortable: true,
        render: (row: DLCode) => (
            <Link to={activityCodePath({WorkCenter: row.workCenter, ActivityCode: row.activityCode})}
                  onClick={(ev) => ev.stopPropagation()}>{row.activityCode ?? row.operationCode}</Link>
        )
    },
    {field: 'description', title: 'Description', sortable: true},
    {
        field: 'StdRatePiece',
        title: 'Sage Cost',
        align: 'end',
        className: (row: DLCode) => classNames({
            'text-danger': new Decimal(row.directLaborCost ?? 0).sub(row.StdRatePiece ?? 0).abs().gte(0.001),
        }),
        sortable: true,
        render: (row: DLCode) => row.activityCode ? numeral(row.StdRatePiece).format('$0,0.0000') : null,
    },
    {
        field: 'templates',
        title: 'Templates',
        sortable: true,
        align: 'end',
        render: (row: DLCode) => (row.templates ?? []).length
    },
    {
        field: "dlCode",
        title: 'D/L Act. Code',
        sortable: true,
        render: (row: DLCode) => <Link to={dlCodePath(row.id)}>{row.dlCode}</Link>
    },
    {
        field: 'directLaborCost',
        title: 'D/L Cost',
        sortable: true,
        align: 'end',
        render: (row: DLCode) => <NumericTableValue value={row.directLaborCost} format="$0,0.0000"/>
    },
]
