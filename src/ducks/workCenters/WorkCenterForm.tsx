import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {
    selectActivityCodeChanges,
    selectCurrentWorkCenter,
    selectLoading,
    selectSaving,
    selectTemplateChanges
} from "./selectors";
import {FormColumn, SpinnerButton} from "chums-components";
import {loadActivityCodeChanges, loadTemplateChanges, saveWorkCenter, setCurrentWorkCenter} from "./actions";
import {useParams} from "react-router-dom";
import {Helmet} from 'react-helmet'
import {useAppDispatch, useAppSelector} from "../../app/configureStore";


const WorkCenterForm = () => {
    const dispatch = useAppDispatch();
    const params = useParams<{ workCenter: string }>()
    const workCenter = useSelector(selectCurrentWorkCenter);
    const templateChanges = useAppSelector(selectTemplateChanges);
    const activityCodeChanges = useAppSelector(selectActivityCodeChanges);

    const saving = useSelector(selectSaving);
    const loading = useSelector(selectLoading);
    const [rate, setRate] = useState<number | string | null>(workCenter?.averageHourlyRate ?? null);

    useEffect(() => {
        if (params.workCenter) {
            dispatch(setCurrentWorkCenter(params.workCenter));
        }
    }, [params]);

    useEffect(() => {
        setRate(workCenter?.averageHourlyRate ?? null);
        if (workCenter?.workCenter) {
            dispatch(loadTemplateChanges(workCenter.workCenter));
            dispatch(loadActivityCodeChanges(workCenter.workCenter));
        }
    }, [workCenter, loading]);

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
        <div>
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


            <div className="mt-3">
                <a href={`/api/operations/production/dl/codes/template-import/${workCenter.workCenter}.txt`} style={{display: 'block'}}>
                    Download Template Changes ({templateChanges})
                </a>
                <div className="text-secondary">Use VI Job: PM_TEMPLATE</div>
            </div>
            <div className="mt-1">
                <a href={`/api/operations/production/dl/codes/activity-code-import/${workCenter.workCenter}.txt`} style={{display: 'block'}}>
                    Download Activity Code Changes ({activityCodeChanges})
                </a>
                <div className="text-secondary">Use VI Job: PM_ACTCODE_COST</div>
            </div>
            <div className="text-secondary mt-1">After recalculating the D/L Codes Costs, download the above files to
                import to Sage.
                <strong className="ms-3">Note:</strong> This is tested on CHU, It might not be correct correctly
                for other Work Centers.
            </div>
        </div>
    )
}
export default WorkCenterForm;
