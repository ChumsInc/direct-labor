import React from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectLoading} from "./selectors";
import {recalcDLCodes} from "./actions";
import {Alert, SpinnerButton} from "chums-components";

const DirectLaborRecalc = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectLoading);

    const clickHandler = () => {
        dispatch(recalcDLCodes());
    }

    return (
        <div className="mt-3">
            <hr />
            <h3>Recalculate DL Codes</h3>
            <div>
                <SpinnerButton color="warning" onClick={clickHandler} spinning={loading}>Recalculate All D/L Codes
                    Costs</SpinnerButton>
            </div>
            <Alert color="warning" title="Caution">
                This will recalculate the costs of all Direct Labor Codes for the current Work Center rate.
            </Alert>
        </div>

    )

}
export default DirectLaborRecalc;
