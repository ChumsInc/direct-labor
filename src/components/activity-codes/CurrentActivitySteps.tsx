import React from 'react';
import {useAppSelector} from "@/app/configureStore";
import {selectCurrentActivityCodeSteps} from "@/ducks/activity-codes/selectors";
import {DataTable, SortableTableField} from "@chumsinc/sortable-tables";
import {WorkTemplateStep} from "chums-types";
import {calculateStepLaborCost, templateStepKey} from "@/ducks/templates/utils";
import numeral from "numeral";

const fields: SortableTableField<WorkTemplateStep>[] = [
    {field: 'TemplateNo', title: 'Template No', sortable: true},
    {field: 'StepNo', title: 'Step No', sortable: true},
    {field: 'ActivityCode', title: 'Activity Code', sortable: true},
    {field: 'TemplateDesc', title: 'Description', sortable: true},
    {
        field: 'ScalingFactorLabor',
        title: 'Labor Rate',
        sortable: true,
        align: 'end',
        render: (row) => numeral(row.BudgetLaborCost).format('$0,0.00')
    },
    {
        field: 'ScalingFactorLabor',
        title: 'Labor Factor',
        sortable: true,
        align: 'end',
        render: (row) => numeral(row.ScalingFactorLabor).format('0,0.0000')
    },
    {field: 'ScalingFactorLabor', title: 'Step Labor Cost', render: (row) => calculateStepLaborCost(row), align: 'end'},

]
const CurrentActivitySteps = () => {
    const steps = useAppSelector(selectCurrentActivityCodeSteps);

    return (
        <div>
            <h3>Where Used</h3>
            <DataTable size="xs" fields={fields} data={steps} keyField={templateStepKey}/>
        </div>
    )
}

export default CurrentActivitySteps;
