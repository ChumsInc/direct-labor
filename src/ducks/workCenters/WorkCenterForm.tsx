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
    const [rate, setRate] = useState<number|string | null>(workCenter?.averageHourlyRate ?? null);

    useEffect(() => {
        if (params.workCenter) {
            dispatch(setCurrentWorkCenter(params.workCenter));
        }
    }, [params]);

    useEffect(() => {
        setRate(workCenter?.averageHourlyRate ?? null);
    }, [workCenter])

    const onChangeRate = (ev: ChangeEvent<HTMLInputElement>) => {
        setRate(ev.target.valueAsNumber ?? 0);
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (!rate || !workCenter) {
            return;
        }
        dispatch(saveWorkCenter({...workCenter, averageHourlyRate: rate}));
    }

    if (!workCenter) {
        return null;
    }

    return (
        <form onSubmit={onSubmit}>
            <Helmet>
                <title>D/L WC: {workCenter.workCenter}</title>
            </Helmet>
            <div className="row g-3 align-items-baseline">
                <h3 className="col-auto">{workCenter.workCenter}</h3>
                <div className="col-auto">{workCenter.workCenterDesc}</div>
            </div>
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
