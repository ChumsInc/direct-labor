import React, {ChangeEvent, FormEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadingSelector, savingSelector, selectedWorkCenterSelector} from "./index";
import {Alert, FormColumn, Input, SpinnerButton} from "chums-ducks";
import numeral from "numeral";
import {changeWorkCenterAction, saveWorkCenterRate} from "./actions";

const SelectedWorkCenter:React.FC = () => {
    const dispatch = useDispatch();
    const selected = useSelector(selectedWorkCenterSelector);
    const saving = useSelector(savingSelector);
    const loading = useSelector(loadingSelector)
    const onChangeRate = (ev:ChangeEvent<HTMLInputElement>) => {
        const rate = Number(ev.target.value || 0);
        dispatch(changeWorkCenterAction(rate));
    }
    const onSubmit = (ev:FormEvent) => {
        ev.preventDefault();
        dispatch(saveWorkCenterRate());
    }

    if (!selected) {
        return (
            <Alert color="info">Select a work center</Alert>
        )
    }
    const {WorkCenterCode, Description, CommentLine1, CommentLine2, AverageHourlyRate} = selected;
    return (
        <form onSubmit={onSubmit}>
            <div className="row g-3 align-items-baseline">
                <h3 className="col-auto">{WorkCenterCode}</h3>
                <div className="col-auto">{Description}</div>
            </div>
            <FormColumn label="Notes">
                <div>{CommentLine1 || 'N/A'}</div>
                <div>{CommentLine2}</div>
            </FormColumn>
            <FormColumn label="Average Hourly Rate">
                <Input type="number" className="form-control form-control-sm"
                       onChange={onChangeRate}
                       value={numeral(AverageHourlyRate || 0).format('0.0000')}
                       min={0} max={100} step={0.01} />
            </FormColumn>
            <FormColumn label="">
                <SpinnerButton type="submit" spinning={saving} disabled={loading}>Save</SpinnerButton>
            </FormColumn>
        </form>
    )
}
export default SelectedWorkCenter;
