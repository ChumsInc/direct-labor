import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectDLCodesStatus} from "./selectors";
import {recalculateDLCodes} from "./actions";
import {Alert} from "react-bootstrap";
import SpinnerButton from "@/components/common/SpinnerButton";

const DirectLaborRecalc = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectDLCodesStatus);

    const clickHandler = () => {
        dispatch(recalculateDLCodes());
    }

    return (
        <div className="mt-3">
            <hr/>
            <h3>Recalculate DL Codes</h3>
            <div>
                <SpinnerButton variant="warning" onClick={clickHandler} spinning={status === 'calculating'}
                               spinnerProps={{size: 'sm'}}>
                    Recalculate All D/L Codes Costs
                </SpinnerButton>
            </div>
            <Alert variant="warning my-3" title="Caution">
                This will recalculate the costs of all Direct Labor Codes for the current Work Center rate.
            </Alert>
        </div>

    )

}
export default DirectLaborRecalc;
