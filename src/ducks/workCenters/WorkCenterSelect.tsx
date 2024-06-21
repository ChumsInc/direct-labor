import React, {ChangeEvent, SelectHTMLAttributes, useEffect} from "react";
import {useSelector} from "react-redux";
import {BootstrapSize, Select} from "chums-components";
import {loadWorkCenters} from "./actions";
import {workCenterIcon} from "../../icons";
import {WorkCenter} from "chums-types";
import {useAppDispatch} from "../../app/configureStore";
import {selectSortedWorkCenters, selectWorkCentersLoaded} from "./selectors";

export interface WorkCenterSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    value: string,
    bsSize?: BootstrapSize
    filterRated?: boolean,
    onSelectWorkCenter?: (wc: WorkCenter | null) => void
}

const WorkCenterSelect = ({
                              value,
                              bsSize,
                              filterRated,
                              onSelectWorkCenter,
                              onChange,
                              ...rest
                          }: WorkCenterSelectProps) => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectWorkCentersLoaded);
    const list = useSelector(selectSortedWorkCenters);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadWorkCenters());
        }
    }, [])

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [wc] = list.filter(wc => wc.WorkCenterCode === ev.target.value);
        if (onSelectWorkCenter) {
            onSelectWorkCenter(wc || null);
        } else if (onChange) {
            onChange(ev);
        }
    }

    return (
        <div className="input-group">
            <div className="input-group-text"><span className={workCenterIcon}/></div>
            <Select value={value} onChange={changeHandler} bsSize={bsSize} {...rest}>
                <option value="">Select Work Center</option>
                <optgroup label="Std Work Centers">

                    {list
                        .filter(wc => wc.isStandardWC)
                        .map(wc => (
                            <option key={wc.WorkCenterCode}
                                    value={wc.WorkCenterCode}>
                                {wc.WorkCenterCode} / {wc.Description}
                            </option>
                        ))
                    }
                </optgroup>
                <optgroup label="In House Work Centers">
                    {list
                        .filter(wc => !wc.isStandardWC)
                        .filter(wc => !wc.OutsideProcessing)
                        .map(wc => (
                            <option key={wc.WorkCenterCode}
                                    value={wc.WorkCenterCode}>
                                {wc.WorkCenterCode} / {wc.Description}
                            </option>
                        ))
                    }
                </optgroup>
                <optgroup label="Other Work Centers">
                    {list
                        .filter(wc => !wc.isStandardWC)
                        .filter(wc => wc.OutsideProcessing)
                        .map(wc => (
                            <option key={wc.WorkCenterCode}
                                    value={wc.WorkCenterCode}>
                                {wc.WorkCenterCode} / {wc.Description}
                            </option>
                        ))
                    }
                </optgroup>
            </Select>
        </div>
    )
}

export default WorkCenterSelect;
