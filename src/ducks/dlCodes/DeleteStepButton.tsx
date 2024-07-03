import React from "react";
import {removeDLStep} from "./actions";
import {DLCodeStep} from "chums-types";
import {selectCurrentDLCodeStatus} from "./selectors";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";

export interface DeleteStepButtonProps {
    step: DLCodeStep,
}

const DeleteStepButton: React.FC<DeleteStepButtonProps> = ({step}) => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectCurrentDLCodeStatus)

    const clickHandler = () => {
        if (window.confirm(`Are you sure you want to delete step #${step.stepOrder + 1} '${step.stepCode}'`)) {
            dispatch(removeDLStep(step));
        }
    }

    return (
        <button className="btn btn-xs btn-danger" type="button" onClick={clickHandler} disabled={status !== 'idle'}>
            <span className="bi-x-lg"/>
        </button>
    )
}
export default DeleteStepButton;
