import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {
    selectCurrentActivityCodeSteps,
    selectCurrentActivityCodeStepSort,
    selectCurrentActivityDLCodes
} from "./selectors";
import {DataTable, SortableTable, SortableTableField} from "chums-components";
import {DLCode, SortProps, WorkTemplateStep} from "chums-types";
import {setACTemplateStepsSort} from "./actions";
import {calculateStepLaborCost, templateStepKey} from "../templates/utils";
import numeral from "numeral";
import NumericTableValue from "../../components/NumericTableValue";
import classNames from "classnames";
import Decimal from "decimal.js";
import {dlCodePath} from "../../routerPaths";

const fields: SortableTableField<DLCode>[] = [
    {field: 'dlCode', title: 'D/L Code', sortable: true, render: (row) => <Link to={dlCodePath(row.id)}>{row.dlCode}</Link>},
    {field: 'description', title: 'Description', sortable: true},
    {field: 'standardAllowedMinutes', title: 'SAM', sortable: true, render: (row: DLCode) => <NumericTableValue value={row.standardAllowedMinutes} format="0,0.0000"/>},
    {field: 'workCenter', title: 'Work Center', sortable: true},
    {field: 'activityCode', title: 'Activity Code', sortable: true},
    {
        field: 'directLaborCost',
        title: 'D/L Cost',
        sortable: true,
        align: 'end',
        render: (row: DLCode) => <NumericTableValue value={row.laborBudget} format="$0,0.0000" />
    },
    {
        field: 'fixedCosts',
        title: 'Fixed Costs',
        sortable: true,
        className: 'right',
        render: (row: DLCode) => <NumericTableValue value={row.fixedCosts} format="$0,0.000" />
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
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const dlCodes = useAppSelector(selectCurrentActivityDLCodes);

    const rowClassName = (row:DLCode) => {
        return classNames({
            'table-warning': !row.active
        })
    }

    return (
        <div>
            <h3>DL Codes</h3>
            <DataTable size="xs" fields={fields} data={dlCodes} keyField={templateStepKey} rowClassName={rowClassName}/>
        </div>
    )
}

export default CurrentActivityDLCodes;
