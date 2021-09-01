import React from "react";
import {useDispatch} from "react-redux";
import {deleteStepAction} from "./actions";
import {DLCodeStep} from "../types";

export interface DeleteStepButtonProps {
    step:DLCodeStep,
}

const DeleteStepButton:React.FC<DeleteStepButtonProps> = ({step}) => {
    const dispatch = useDispatch();

    const clickHandler = () => {
        if (window.confirm(`Are you sure you want to delete step #${step.stepOrder + 1} '${step.stepCode}'`)) {
            dispatch(deleteStepAction(step.id));
        }
    }

    return (
        <button className="btn btn-xs btn-danger" type="button" onClick={clickHandler}><span className="bi-x-lg" /></button>
    )
}
export default DeleteStepButton;
