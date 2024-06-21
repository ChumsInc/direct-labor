import React, {ChangeEvent, useEffect, useId} from 'react';
import {useSelector} from "react-redux";
import {OperationCode} from "chums-types";
import {InputGroup, Select} from "chums-components";
import {loadOperationCodes} from "./actions";
import {selectLoaded, selectOperationCodeList} from "./selectors";
import {operationCodeKey} from "./utils";
import {sageOperationCodeIcon} from "../../icons";
import classNames from "classnames";
import {useAppDispatch} from "../../app/configureStore";

export interface OperationCodeSelectProps {
    operationCode: string,
    workCenter: string,
    onChange: (opCode: OperationCode | null) => void,
}

const OperationCodeSelect = ({operationCode, workCenter, onChange}: OperationCodeSelectProps) => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectLoaded)
    const operationCodes = useSelector(selectOperationCodeList);
    const options = Object.values(operationCodes).filter(oc => !workCenter || oc.WorkCenter === workCenter);
    const id = useId();

    useEffect(() => {
        if (!loaded) {
            dispatch(loadOperationCodes())
        }
    }, [])

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [wc] = operationCodes.filter(oc => operationCodeKey(oc) === ev.target.value);
        onChange(wc || null);
    }

    const value = operationCodeKey({OperationCode: operationCode, WorkCenter: workCenter});
    return (
        <InputGroup>
            <label className={classNames("input-group-text", sageOperationCodeIcon)} htmlFor={id}/>
            <Select value={value} onChange={changeHandler} id={id}>
                <option value="">Select OperationCode</option>
                {options.map(oc => (
                    <option key={operationCodeKey(oc)} value={operationCodeKey(oc)}>
                        {!workCenter ? oc.WorkCenter + ':' : ''}{oc.OperationCode} / {oc.OperationDescription}
                    </option>
                ))}
            </Select>
        </InputGroup>
    )
}

export default OperationCodeSelect;
