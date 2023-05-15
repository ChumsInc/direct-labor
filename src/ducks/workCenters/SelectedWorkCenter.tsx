import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentWorkCenter, selectLoading, selectSaving, selectWorkCenter} from "./index";
import {Alert, FormColumn, SpinnerButton} from "chums-components";
import {saveWorkCenter, setCurrentWorkCenter} from "./actions";
import {useHistory} from "react-router-dom";
import {workCentersPath} from "../../routerPaths";
import {Helmet} from 'react-helmet'
import {useAppDispatch, useAppSelector} from "../../app/configureStore";

export interface SelectedWorkCenterProps {
    workCenter?: string,
}

const SelectedWorkCenter: React.FC<SelectedWorkCenterProps> = ({workCenter}) => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const selected = useSelector(selectCurrentWorkCenter);
    const saving = useSelector(selectSaving);
    const loading = useSelector(selectLoading);
    const navWC = useAppSelector((state) => selectWorkCenter(state, workCenter));
    const [rate, setRate] = useState<number | null>(selected?.AverageHourlyRate ?? null);

    useEffect(() => {
        setRate(selected?.AverageHourlyRate ?? null);
    }, [selected])

    const onChangeRate = (ev: ChangeEvent<HTMLInputElement>) => {
        setRate(ev.target.valueAsNumber ?? 0);
    }
    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (!rate || !selected) {
            return;
        }
        dispatch(saveWorkCenter({...selected, AverageHourlyRate: rate}));
    }

    useEffect(() => {
        console.log(workCenter, navWC, selected);
        if (!!workCenter) {
            if (!navWC) {
                return history.replace(workCentersPath);
            } else if (!selected || selected.WorkCenterCode !== workCenter) {
                dispatch(setCurrentWorkCenter(navWC));
            }
        } else {
            dispatch(setCurrentWorkCenter(null));
        }
    }, [workCenter, loading]);

    if (!selected) {
        return (
            <Alert color="info">Select a work center</Alert>
        )
    }
    const {WorkCenterCode, Description, CommentLine1, CommentLine2} = selected;
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
                <input type="number" className="form-control form-control-sm"
                       onChange={onChangeRate}
                       value={rate ?? 0}
                       min={0} max={100} step={0.0001}/>
            </FormColumn>
            <FormColumn label="">
                <SpinnerButton type="submit" spinning={saving} disabled={loading}>Save</SpinnerButton>
            </FormColumn>
        </form>
    )
}
export default SelectedWorkCenter;
