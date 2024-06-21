import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentWorkCenter, selectLoading, selectSaving} from "./selectors";
import {Alert, FormColumn, SpinnerButton} from "chums-components";
import {saveWorkCenter, setCurrentWorkCenter} from "./actions";
import {useMatch, useParams} from "react-router-dom";
import {Helmet} from 'react-helmet'
import {useAppDispatch} from "../../app/configureStore";


const WorkCenterForm = () => {
    const dispatch = useAppDispatch();
    const params = useParams<{ workCenter: string }>()
    const workCenter = useSelector(selectCurrentWorkCenter);
    const saving = useSelector(selectSaving);
    const loading = useSelector(selectLoading);
    const [rate, setRate] = useState<number | null>(workCenter?.AverageHourlyRate ?? null);

    useEffect(() => {
        if (params.workCenter) {
            dispatch(setCurrentWorkCenter(params.workCenter));
        }
    }, [params]);

    useEffect(() => {
        setRate(workCenter?.AverageHourlyRate ?? null);
    }, [workCenter])

    const onChangeRate = (ev: ChangeEvent<HTMLInputElement>) => {
        setRate(ev.target.valueAsNumber ?? 0);
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (!rate || !workCenter) {
            return;
        }
        dispatch(saveWorkCenter({...workCenter, AverageHourlyRate: rate}));
    }

    if (!workCenter) {
        return null;
    }

    const {WorkCenterCode, Description, CommentLine1, CommentLine2} = workCenter;
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
export default WorkCenterForm;
