import {useCallback, useEffect, useState} from "react";
import type {DLStepTotal} from "../types";
import {selectCurrentHeader, selectCurrentSteps} from "./selectors";
import {useSelector} from "react-redux";
import {saveDLStepSort} from "./actions";
import {stepTotalReducer} from "./utils";
import {useAppDispatch} from "@/app/configureStore";
import AddDLStepForm from "@/ducks/dlCodes/AddDLStepForm";
import type {DLCodeStep} from "chums-types";
import SortableDLSteps from "@/ducks/dlCodes/SortableDLSteps.tsx";
import {Button} from "react-bootstrap";
import {DLStepItemsTotal} from "@/ducks/dlCodes/DLStepItemsTotal.tsx";


const stepsKey = (steps: DLCodeStep[]): string => {
    return steps.map(step => step.id).join(':');
}


const SelectedStepsList = () => {
    const dispatch = useAppDispatch();
    const selected = useSelector(selectCurrentHeader);
    const steps = useSelector(selectCurrentSteps);
    const total: DLStepTotal = stepTotalReducer(steps);
    const [list, setList] = useState(steps ?? []);
    const [sorted, setSorted] = useState(stepsKey(steps));
    const [savedSort, setSaveSort] = useState(stepsKey(steps));

    useEffect(() => {
        setList(steps);
        setSorted(stepsKey(steps));
        setSaveSort(stepsKey(steps));
    }, [steps])

    const onSortChange = useCallback((items: DLCodeStep[]) => {
        setList(items);
        setSorted(stepsKey(items));
    }, [])

    const saveHandler = () => {
        dispatch(saveDLStepSort(list));
    }

    if (!selected) {
        return null;
    }

    return (
        <div>
            <SortableDLSteps list={list} onSortChange={onSortChange}/>
            <DLStepItemsTotal total={total}/>
            <AddDLStepForm saveButtonSlot={
                <div className="col-auto">
                    <Button size="sm" variant={sorted === savedSort ? 'outline-secondary' : 'warning'} type="button"
                            onClick={saveHandler}>Save Step Order</Button>
                </div>
            }/>
        </div>
    )

}
export default SelectedStepsList;
