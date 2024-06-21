import React from 'react';
import {Link} from 'react-router-dom';
import {DLBasicStep} from "chums-types";
import numeral from "numeral";
import {dlStepPath} from "../../routerPaths";
import {SortableTableField} from "chums-components";
import Decimal from "decimal.js";
import classNames from "classnames";


export const stepsListFields: SortableTableField<(DLBasicStep)>[] = [
    {
        field: 'stepCode',
        title: 'Step Code',
        sortable: true,
        render: (row: DLBasicStep) => <Link to={dlStepPath(row.id)}>{row.stepCode}</Link>,
    },
    {field: 'description', title: 'Description', sortable: true,},
    {field: 'workCenter', title: 'Work Center', sortable: true},
    {field: 'machine', title: 'Machine', sortable: true},
    {
        field: 'standardAllowedMinutes',
        title: 'SAM',
        className: (row) => classNames({'text-end': true, 'text-secondary': new Decimal(row.standardAllowedMinutes).eq(0)}),
        sortable: true,
        render: ({standardAllowedMinutes}) => numeral(standardAllowedMinutes).format('0,0.0000')
    },
    {
        field: 'fixedCosts',
        title: 'Fixed Costs',
        className: (row: DLBasicStep) => classNames({
            'text-end': true,
            'text-secondary': new Decimal(row.fixedCosts).eq(0)
        }),
        sortable: true,
        render: ({fixedCosts}: DLBasicStep) => numeral(fixedCosts).format('0,0.0000')
    },
    {
        field: 'stepCost',
        title: 'Step Cost',
        className: 'text-end',
        sortable: true,
        render: ({stepCost}: DLBasicStep) => numeral(stepCost).format('0,0.0000')
    },
];
