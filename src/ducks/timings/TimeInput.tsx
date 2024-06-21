import React, {ButtonHTMLAttributes, ChangeEvent, forwardRef, InputHTMLAttributes} from 'react';
import Decimal from "decimal.js";
import {regexpMinSec} from "../../utils/math";

export interface TimeInputProps {
    value: number | string;
    required?: boolean;
    inputProps?: InputHTMLAttributes<HTMLInputElement>;
    buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
    onChange: (value: string) => void;
    children?: React.ReactNode;
}

const TimeInput = forwardRef(function TimeInputElement({
                                                           value,
                                                           inputProps,
                                                           required,
                                                           onChange,
                                                       }: TimeInputProps,
                                                       ref: React.Ref<HTMLInputElement>) {
    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(ev.target.valueAsNumber) || ev.target.value === '' || regexpMinSec.test(ev.target.value)) {
            onChange(ev.target.value);
        }
    }
    return (
        <input type="text" className="form-control dl-timing--timing-entry" required={required}
               value={value} onChange={changeHandler}
               {...inputProps}
               ref={ref}/>
    )
})

export default TimeInput
