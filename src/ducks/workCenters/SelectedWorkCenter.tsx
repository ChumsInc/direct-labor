import React, {ChangeEvent, FormEvent, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadingSelector, savingSelector, selectedWorkCenterSelector, workCenterSelector} from "./index";
import {Alert, FormColumn, Input, SpinnerButton} from "chums-ducks";
import numeral from "numeral";
import {changeWorkCenterAction, saveWorkCenterRate, selectWorkCenterAction} from "./actions";
import {useHistory} from "react-router-dom";
import {workCentersPath} from "../../routerPaths";
import {Helmet} from 'react-helmet'

export interface SelectedWorkCenterProps {
    workCenter?: string,
}

const SelectedWorkCenter: React.FC<SelectedWorkCenterProps> = ({workCenter}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const selected = useSelector(selectedWorkCenterSelector);
    const saving = useSelector(savingSelector);
    const loading = useSelector(loadingSelector);
    const navWC = useSelector(workCenterSelector(workCenter));
    const onChangeRate = (ev: ChangeEvent<HTMLInputElement>) => {
        const rate = Number(ev.target.value || 0);
        dispatch(changeWorkCenterAction(rate));
    }
    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveWorkCenterRate());
    }

    useEffect(() => {
        console.log(workCenter, navWC, selected);
        if (!!workCenter) {
            if (!navWC) {
                return history.replace(workCentersPath);
            } else if (!selected || selected.WorkCenterCode !== workCenter) {
                dispatch(selectWorkCenterAction(navWC));
            }
        } else {
            dispatch(selectWorkCenterAction(null));
        }
    }, [workCenter, loading]);

    if (!selected) {
        return (
            <Alert color="info">Select a work center</Alert>
        )
    }
    const {WorkCenterCode, Description, CommentLine1, CommentLine2, AverageHourlyRate} = selected;
    return (
        <form onSubmit={onSubmit}>
            <Helmet>
                <title>D/L WC: {WorkCenterCode}</title>
            </Helmet>
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
                       min={0} max={100} step={0.01}/>
            </FormColumn>
            <FormColumn label="">
                <SpinnerButton type="submit" spinning={saving} disabled={loading}>Save</SpinnerButton>
            </FormColumn>
        </form>
    )
}
export default SelectedWorkCenter;
