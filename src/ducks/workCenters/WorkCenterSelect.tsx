import React, {ChangeEvent, SelectHTMLAttributes, useEffect} from "react";
import {defaultWorkCenterSort, WorkCenter} from "./types";
import {useDispatch, useSelector} from "react-redux";
import {listSelector, loadedSelector} from './index'
import {BootstrapSize, Select} from "chums-ducks";
import {loadWorkCentersAction} from "./actions";

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
    const dispatch = useDispatch();
    const loaded = useSelector(loadedSelector);
    useEffect(() => {
        if (!loaded) {
            dispatch(loadWorkCentersAction());
        }
    }, [])
    const list: WorkCenter[] = useSelector(listSelector(defaultWorkCenterSort));
    const filteredList = list.filter(wc => !filterRated || wc.isStandardWC);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [wc] = list.filter(wc => wc.WorkCenterCode === ev.target.value);
        if (onSelectWorkCenter) {
            onSelectWorkCenter(wc || null);
        } else if (onChange) {
            onChange(ev);
        }
    }

    return (
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
    )
}

export default WorkCenterSelect;
