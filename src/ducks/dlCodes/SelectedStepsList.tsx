import React, {useEffect, useState} from "react";
import {DLCodeStep, DLStepCodeTableField, DLStepTotal} from "../types";
import {SortableTable} from "chums-ducks";
import numeral from "numeral";
import {selectedStepsSelector} from "./selectors";
import {useDispatch, useSelector} from "react-redux";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import DraggableTR from "./DraggableTR";
import DeleteStepButton from "./DeleteStepButton";
import {saveDLCodeStepOrder} from "./actions";
import {dlCodeStepSorter, stepTotalReducer} from "./utils";
import {Link} from "react-router-dom";
import {dlStepPath} from "../../routerPaths";

const tableKey = 'dl-steps-detail';

export const stepsListFields: DLStepCodeTableField[] = [
    {field: 'stepOrder', title: 'Step', render: ({stepOrder}: DLCodeStep) => String(stepOrder + 1)},
    {field: 'stepCode', title: 'Step Code', render: (row:DLCodeStep) => (<Link to={dlStepPath(row.stepId)}>{row.stepCode}</Link>)},
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

const SelectedStepsList: React.FC = () => {
    const dispatch = useDispatch();
    const steps = useSelector(selectedStepsSelector);
    const stepKeys = steps.map(step => step.id).join(':');
    const total: DLStepTotal = stepTotalReducer(steps);
    const [list, setList] = useState(steps);
    useEffect(() => {
        setList(steps);
    }, [stepKeys])

    const onMoveStep = (dragIndex: number, hoverIndex: number) => {
        const sorted = [...list];
        const movingItem = sorted[dragIndex];
        sorted.splice(dragIndex, 1);
        sorted.splice(hoverIndex, 0, movingItem);
        let priority = 0;
        sorted.forEach(item => {
            item.stepOrder = priority;
            priority += 1;
        });
        setList(sorted);
    }

    const dropHandler = () => {
        dispatch(saveDLCodeStepOrder(list));
    }

    return (
        <SortableTable tableKey={tableKey} keyField={"id"} fields={stepsListFields} data={[]} size="xs">
            <tbody>
            <DndProvider backend={HTML5Backend}>
                {list.sort(dlCodeStepSorter)
                    .map((step, index) => (
                        <DraggableTR key={step.id} index={index} fields={stepsListFields} row={step}
                                     moveItem={onMoveStep} onDrop={dropHandler}/>
                    ))}
            </DndProvider>
            </tbody>
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
        </SortableTable>
    )

}
export default SelectedStepsList;
