import React, {type ButtonHTMLAttributes, type ChangeEvent, forwardRef, type InputHTMLAttributes} from 'react';

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
        if (ev.target.validity.valid) {
            onChange(ev.target.value);
        }
    }
    return (
        <input type="text" className="form-control dl-timing--timing-entry" required={required}
               value={value} onChange={changeHandler} pattern="^\d+\.*\d*"
               {...inputProps}
               ref={ref}/>
    )
})

export default TimeInput
