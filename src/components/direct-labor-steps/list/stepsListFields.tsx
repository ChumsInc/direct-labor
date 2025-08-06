import {Link} from 'react-router';
import type {DLBasicStep} from "chums-types";
import numeral from "numeral";
import {dlStepPath} from "@/app/routerPaths.ts";
import {type SortableTableField} from "@chumsinc/sortable-tables";
import classNames from "classnames";
import Decimal from "decimal.js";
import {unitsPerHour} from "@/utils/math.ts";


export const stepsListFields: SortableTableField<(DLBasicStep)>[] = [
    {field: 'workCenter', title: 'Work Center', sortable: true},
    {
        field: 'stepCode',
        title: 'Step Code',
        sortable: true,
        render: (row: DLBasicStep) => <Link to={dlStepPath(row.id)}>{row.stepCode}</Link>,
    },
    {field: 'description', title: 'Description', sortable: true,},
    {field: 'machine', title: 'Machine', sortable: true},
    {
        field: 'standardAllowedMinutes',
        title: 'SAM',
        align: 'end',
        sortable: true,
        render: (row) => numeral(row.standardAllowedMinutes).format('0,0.0000'),
        className: row => classNames({'text-secondary': row.standardAllowedMinutes === 0})
    },
    {
        field: 'standardAllowedMinutes',
        title: 'UPH',
        align: 'end',
        sortable: true,
        render: (row) => unitsPerHour(row.standardAllowedMinutes),
        className: row => classNames({'text-secondary': row.standardAllowedMinutes === 0})
    },
    {
        field: 'fixedCosts',
        title: 'Fixed Costs',
        align: 'end',
        sortable: true,
        render: (row) => numeral(row.fixedCosts).format('$ 0,0.0000'),
        className: row => classNames({'text-secondary': new Decimal(row.fixedCosts).eq(0)})
    },
    {
        field: 'stepCost',
        title: 'Step Cost',
        align: 'end',
        sortable: true,
        render: ({stepCost}: DLBasicStep) => numeral(stepCost).format('$ 0,0.0000'),
    },
];
