import {type SortableTableField} from "@chumsinc/sortable-tables";
import type {DLCodeStep} from "chums-types";
import {Link} from "react-router";
import {dlStepPath} from "../../routerPaths";
import DeleteStepButton from "./DeleteStepButton";
import numeral from "numeral";

export const stepsListFields: SortableTableField<DLCodeStep>[] = [
    {field: 'stepOrder', title: 'Step', render: ({stepOrder}: DLCodeStep) => String(stepOrder + 1)},
    {
        field: 'stepCode',
        title: 'Step Code',
        render: (row: DLCodeStep) => (<Link to={dlStepPath(row.stepId)}>{row.stepCode}</Link>)
    },
    {field: 'description', title: 'Description'},
    {field: 'workCenter', title: 'Work Center'},
    {field: 'machine', title: 'Machine'},
    {
        field: 'standardAllowedMinutes',
        title: 'SAM',
        className: 'text-end',
        render: ({standardAllowedMinutes}: DLCodeStep) => numeral(standardAllowedMinutes).format('0,0.0000')
    },
    {
        field: 'fixedCosts',
        title: 'Fixed Costs',
        className: 'text-end',
        render: ({fixedCosts}: DLCodeStep) => numeral(fixedCosts).format('0,0.0000')
    },
    {
        field: 'stepCost',
        title: 'Step Cost',
        className: 'text-end',
        render: ({stepCost}: DLCodeStep) => numeral(stepCost).format('0,0.0000')
    },
    {field: 'id', title: '-', className: 'text-center', render: (row: DLCodeStep) => <DeleteStepButton step={row}/>},
]
