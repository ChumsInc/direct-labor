import {useEffect, useState} from "react";
import type {DLStepTotal} from "../types";
import numeral from "numeral";
import {selectCurrentHeader, selectCurrentSteps} from "./selectors";
import {useSelector} from "react-redux";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import DraggableTR from "./DraggableTR";
import {saveDLStepSort} from "./actions";
import {stepTotalReducer} from "./utils";
import classNames from "classnames";
import {useAppDispatch} from "@/app/configureStore";
import AddDLStepForm from "@/ducks/dlCodes/AddDLStepForm";
import {stepsListFields} from "@/ducks/dlCodes/stepsListFields.tsx";
import styled from "@emotion/styled";
import type {DLCodeStep} from "chums-types";

const StepsContainer = styled.div`
    .draggable-tr {
        padding: 0.5rem 1rem;
        margin-bottom: .5rem;
        cursor: move;
        opacity: 1;
        &.is-dragging {
            opacity: 0;
        }
    }
`
const stepsKey = (steps:DLCodeStep[]):string => {
    return steps.map(step => step.id).join(':');
}

const SelectedStepsList = () => {
    const dispatch = useAppDispatch();
    const selected = useSelector(selectCurrentHeader);
    const steps = useSelector(selectCurrentSteps);
    
    const total: DLStepTotal = stepTotalReducer(steps);
    const [list, setList] = useState(steps ?? []);

    useEffect(() => {
        if (stepsKey(steps) !== stepsKey(list)) {
            setList(steps);    
        }
    }, [list, steps])

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
        <StepsContainer>
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
        </StepsContainer>
    )

}
export default SelectedStepsList;
