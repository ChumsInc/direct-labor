import {Link} from 'react-router';
import type {DLBasicStep} from "chums-types";
import numeral from "numeral";
import {dlStepPath} from "../../routerPaths";
import {type SortableTableField} from "@chumsinc/sortable-tables";


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
        field: 'stepCost',
        title: 'Step Cost',
        className: 'text-end',
        sortable: true,
        render: ({stepCost}: DLBasicStep) => numeral(stepCost).format('0,0.0000')
    },
];
