import React, {ChangeEvent, SelectHTMLAttributes, useEffect} from "react";
import {defaultWorkCenterSort} from "./types";
import {useSelector} from "react-redux";
import {listSelector, selectLoaded} from './index'
import {BootstrapSize, Select} from "chums-ducks";
import {loadWorkCenters} from "./actions";
import {workCenterIcon} from "../../icons";
import {WorkCenter} from "../types";
import {useAppDispatch} from "../../app/configureStore";

export interface WorkCenterSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    value: string,
    bsSize?: BootstrapSize
    filterRated?: boolean,
    onSelectWorkCenter?: (wc: WorkCenter | null) => void
}

const WorkCenterSelect: React.FC<WorkCenterSelectProps> = ({
                                                               value,
                                                               bsSize,
                                                               filterRated,
                                                               onSelectWorkCenter,
                                                               onChange,
                                                               ...rest
                                                           }) => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectLoaded);
    useEffect(() => {
        if (!loaded) {
            dispatch(loadWorkCenters());
        }
    }, [])
    const list: WorkCenter[] = useSelector(listSelector(defaultWorkCenterSort));

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [wc] = list.filter(wc => wc.WorkCenterCode === ev.target.value);
        if (onSelectWorkCenter) {
            onSelectWorkCenter(wc || null);
        } else if (onChange) {
            onChange(ev);
        }
    }

    return (
        <div className="input-group input-group-sm">
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
