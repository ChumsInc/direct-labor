import React, {useEffect, useState} from "react";
import {DLStepTotal} from "../types";
import numeral from "numeral";
import {selectCurrentHeader, selectCurrentSteps} from "./selectors";
import {useSelector} from "react-redux";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import DraggableTR from "./DraggableTR";
import DeleteStepButton from "./DeleteStepButton";
import {saveDLStepSort} from "./actions";
import {stepTotalReducer} from "./utils";
import {Link} from "react-router";
import {dlStepPath} from "../../routerPaths";
import classNames from "classnames";
import {useAppDispatch} from "@/app/configureStore";
import {SortableTableField} from "@chumsinc/sortable-tables";
import {DLCodeStep} from "chums-types";
import AddDLStepForm from "@/ducks/dlCodes/AddDLStepForm";


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

const SelectedStepsList = () => {
    const dispatch = useAppDispatch();
    const selected = useSelector(selectCurrentHeader);
    const steps = useSelector(selectCurrentSteps);
    const stepKeys = steps.map(step => step.id).join(':');
    const total: DLStepTotal = stepTotalReducer(steps);
    const [list, setList] = useState(steps ?? []);

    useEffect(() => {
        setList(steps);
    }, [stepKeys])

    const onMoveStep = (dragIndex: number, hoverIndex: number) => {
        console.log(list, dragIndex, hoverIndex);
        const sorted = [...list];
        const movingItem = sorted[dragIndex];
        sorted.splice(dragIndex, 1);
        sorted.splice(hoverIndex, 0, movingItem);
        setList(() => sorted.map((item, index) => ({...item, stepOrder: index})));
    }

    const dropHandler = () => {
        dispatch(saveDLStepSort(list));
    }


    if (!selected) {
        return null;
    }
    // return null;
    return (
        <div>
            <table className="table table-xs table-hover">
                <thead>
                <tr>
                    {stepsListFields
                        .map(field =>
                            (<th key={String(field.id ?? field.field)}
                                 className={classNames(typeof field.className === "string" ? field.className : '')}>
                                {field.title}
                            </th>)
                        )}
                </tr>
                </thead>
                <DndProvider backend={HTML5Backend}>
                    <tbody>
                    {list
                        .map((step, index) => (
                            <DraggableTR key={step.id} index={index} fields={stepsListFields} row={step}
                                         className={classNames({'table-danger': !step.active})}
                                         moveItem={onMoveStep} onDrop={dropHandler}/>
                        ))}
                    </tbody>
                </DndProvider>
                <tfoot>
                <tr>
                    <th colSpan={3}>Total</th>
                    <th className="text-end">UPH:</th>
                    <th>{numeral(!total.standardAllowedMinutes ? 0 : 60 / total.standardAllowedMinutes).format('0,0.0')}</th>
                    <th className="text-end">{numeral(total.standardAllowedMinutes).format('0,0.0000')}</th>
                    <th className="text-end">{numeral(total.fixedCosts).format('0,0.0000')}</th>
                    <th className="text-end">{numeral(total.stepCost).format('0,0.0000')}</th>
                    <th/>
                </tr>
                </tfoot>
            </table>
            <AddDLStepForm/>
        </div>
    )

}
export default SelectedStepsList;
