import React from 'react';
import {Link} from 'react-router-dom';
import {DLStep} from "chums-types";
import numeral from "numeral";
import {dlStepPath} from "../../routerPaths";
import {SortableTableField} from "chums-components";


export const stepsListFields: SortableTableField<DLStep>[] = [
    {
        field: 'stepCode',
        title: 'Step Code',
        sortable: true,
        render: (row) => (<Link to={dlStepPath(row.id)}>{row.stepCode}</Link>)
    },
    {field: 'description', title: 'Description', sortable: true,},
    {field: 'workCenter', title: 'Work Center', sortable: true},
    {field: 'machine', title: 'Machine', sortable: true},
    {
        field: 'standardAllowedMinutes',
        title: 'SAM',
        className: (row) => ({'text-end': true, 'text-muted': row.standardAllowedMinutes === 0}),
        sortable: true,
        render: ({standardAllowedMinutes}) => numeral(standardAllowedMinutes).format('0,0.0000')
    },
    {
        field: 'fixedCosts',
        title: 'Fixed Costs',
        className: (row) => ({'text-end': true, 'text-muted': row.fixedCosts === 0}),
        sortable: true,
        render: ({fixedCosts}) => numeral(fixedCosts).format('0,0.0000')
    },
    {
        field: 'stepCost',
        title: 'Step Cost',
        className: 'text-end',
        sortable: true,
        render: ({stepCost}) => numeral(stepCost).format('0,0.0000')
    },
];
