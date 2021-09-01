import React from 'react';
import {Link} from 'react-router-dom';
import {DLCodeStep, DLStep, DLStepTableField} from "../types";
import numeral from "numeral";
import {dlStepPath} from "../../routerPaths";


export const stepsListFields: DLStepTableField[] = [
    {
        field: 'stepCode',
        title: 'Step Code',
        sortable: true,
        render: (row: DLStep) => (<Link to={dlStepPath(row.id)}>{row.stepCode}</Link>)
    },
    {field: 'description', title: 'Description', sortable: true,},
    {field: 'workCenter', title: 'Work Center', sortable: true},
    {field: 'machine', title: 'Machine', sortable: true},
    {
        field: 'standardAllowedMinutes',
        title: 'SAM',
        className: (row:DLCodeStep) => ({'text-end': true, 'text-muted': row.standardAllowedMinutes === 0}),
        sortable: true,
        render: ({standardAllowedMinutes}: DLCodeStep) => numeral(standardAllowedMinutes).format('0,0.0000')
    },
    {
        field: 'fixedCosts',
        title: 'Fixed Costs',
        className: (row:DLCodeStep) => ({'text-end': true, 'text-muted': row.fixedCosts === 0}),
        sortable: true,
        render: ({fixedCosts}: DLCodeStep) => numeral(fixedCosts).format('0,0.0000')
    },
    {
        field: 'stepCost',
        title: 'Step Cost',
        className: 'text-end',
        sortable: true,
        render: ({stepCost}: DLCodeStep) => numeral(stepCost).format('0,0.0000')
    },
];
