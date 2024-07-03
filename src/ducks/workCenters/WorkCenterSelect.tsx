import React, {ChangeEvent, SelectHTMLAttributes, useEffect} from "react";
import {useSelector} from "react-redux";
import {BootstrapSize, Select} from "chums-components";
import {loadWorkCenters} from "./actions";
import {workCenterIcon} from "../../icons";
import {WorkCenter} from "chums-types";
import {useAppDispatch} from "../../app/configureStore";
import {selectSortedWorkCenters, selectWorkCenters, selectWorkCentersList, selectWorkCentersLoaded} from "./selectors";

export interface WorkCenterSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    value: string,
    bsSize?: BootstrapSize
    includeUnrated?: boolean,
    onSelectWorkCenter?: (wc: WorkCenter | null) => void;
    children?: React.ReactNode;
}

const WorkCenterSelect = ({
                              value,
                              bsSize,
                              includeUnrated,
                              onSelectWorkCenter,
                              onChange,
                            children,
                              ...rest
                          }: WorkCenterSelectProps) => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectWorkCentersLoaded);
    const list = useSelector(selectWorkCenters);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadWorkCenters());
        }
    }, [])

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [wc] = list.filter(wc => wc.workCenter === ev.target.value);
        if (onSelectWorkCenter) {
            onSelectWorkCenter(wc ?? null);
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
                            <option key={wc.workCenter}
                                    value={wc.workCenter}>
                                {wc.workCenter} / {wc.workCenterDesc}
                            </option>
                        ))
                    }
                </optgroup>
                {includeUnrated && (
                    <optgroup label="Other Work Centers">
                        {list
                            .filter(wc => !wc.isStandardWC)
                            .map(wc => (
                                <option key={wc.workCenter}
                                        value={wc.workCenter}>
                                    {wc.workCenter} / {wc.workCenterDesc}
                                </option>
                            ))
                        }
                    </optgroup>
                )}
            </Select>
            {children}
        </div>
    )
}

export default WorkCenterSelect;
