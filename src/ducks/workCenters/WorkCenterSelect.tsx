import React, {ChangeEvent, useEffect, useId} from "react";
import {useSelector} from "react-redux";
import {loadWorkCenters} from "./actions";
import {workCenterIcon} from "@/utils/icons";
import {WorkCenter} from "chums-types";
import {useAppDispatch} from "../../app/configureStore";
import {selectWorkCenters, selectWorkCentersLoaded} from "./selectors";
import {FormSelect, FormSelectProps, InputGroup} from "react-bootstrap";

export interface WorkCenterSelectProps extends FormSelectProps {
    value: string,
    includeUnrated?: boolean,
    onSelectWorkCenter?: (wc: WorkCenter | null) => void;
    children?: React.ReactNode;
}

const WorkCenterSelect = ({
                              value,
                              size,
                              includeUnrated,
                              onSelectWorkCenter,
                              onChange,
                              children,
                              ...rest
                          }: WorkCenterSelectProps) => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectWorkCentersLoaded);
    const list = useSelector(selectWorkCenters);
    const id = useId();

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
        <InputGroup size={size}>
            <InputGroup.Text as="label" htmlFor={id} className="input-group-text" aria-label="Work Center">
                <span className={workCenterIcon} aria-hidden="true" />
            </InputGroup.Text>
            <FormSelect value={value} onChange={changeHandler} size={size} id={id} {...rest}>
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
            </FormSelect>
            {children}
        </InputGroup>
    )
}

export default WorkCenterSelect;
