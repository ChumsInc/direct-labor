import {useAppSelector} from "../../app/configureStore";
import {selectCurrentTemplateSteps} from "./selectors";
import {DataTable, type DataTableField} from "@chumsinc/sortable-tables";
import {calculateStepLaborCost, templateStepKey} from "./utils";
import type {WorkTemplateStep} from "chums-types";
import {activityCodePath} from "../activity-codes/utils";
import {Link} from "react-router";
import NumericTableValue from "../../components/NumericTableValue";

const fields:DataTableField<WorkTemplateStep>[] = [
    {field: 'StepNo', title: 'Step'},
    {field: 'TemplateDesc', title: 'Description'},
    {field: 'ActivityCode', title: 'Activity Code', render: (row) => <Link to={activityCodePath(row)}>{row.ActivityCode}</Link>},
    {field: 'WorkCenter', title: 'Work Center', },
    {field: 'BudgetLaborCost', title: 'Labor Rate', align: 'end', render: (row) =>  <NumericTableValue value={row.BudgetLaborCost} format="$0,0.0000" />},
    {field: 'ScalingFactorLabor', title: 'Labor Scale Factor', align: 'end', render: (row) =>  <NumericTableValue value={row.ScalingFactorLabor} format="0,0.000" />},
    {field: 'ScalingFactorLabor', title: 'Unit Cost', align: 'end', render: (row) =>  <NumericTableValue value={calculateStepLaborCost(row)} format="$0,0.0000" />}
]
const CurrentTemplateSteps = () => {
    const steps = useAppSelector(selectCurrentTemplateSteps);
    return (
        <DataTable fields={fields} data={steps} keyField={templateStepKey} size="sm" />
    )
}

export default CurrentTemplateSteps;
