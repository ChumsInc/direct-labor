import React, {ChangeEvent, useEffect} from 'react';
import {useSelector} from "react-redux";
import {OperationCode} from "../types";
import {InputGroup, Select} from "chums-components";
import {listSelector, loadOperationCodes, selectLoaded} from "./index";
import {operationCodeKey} from "./utils";
import {sageOperationCodeIcon} from "../../icons";
import classNames from "classnames";
import {useAppDispatch} from "../../app/configureStore";

export interface OperationCodeSelectProps {
    operationCode: string,
    workCenter: string,
    onChange: (opCode: OperationCode | null) => void,
}

const OperationCodeSelect: React.FC<OperationCodeSelectProps> = ({operationCode, workCenter, onChange}) => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectLoaded)
    const operationCodes = useSelector(listSelector);
    const options = Object.values(operationCodes).filter(oc => !workCenter || oc.WorkCenter === workCenter);

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
        <InputGroup bsSize="sm">
            <div className={classNames("input-group-text", sageOperationCodeIcon)}/>
            <Select value={value} onChange={changeHandler}>
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
