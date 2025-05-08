import React, {ChangeEvent, useEffect, useId, useState} from "react";
import classNames from "classnames";
import {FormControl, FormControlProps, InputGroup} from "react-bootstrap";
import {useDebounceValue} from "usehooks-ts";

export interface SearchInputProps extends Omit<FormControlProps, 'onChange'> {
    label?: string;
    icon?: string;
    value: string;
    onChange: (value: string) => void;
}

const SearchInput = ({
                         value,
                         icon,
                         label,
                         size,
                         type = 'search',
                         placeholder,
                         className,
                         onChange,
                         id,
                         ...rest
                     }: SearchInputProps) => {
    const [valid, setValid] = useState(true);
    const [debouncedValue, setValue] = useDebounceValue(value, 350);
    const _id = id ?? useId();

    useEffect(() => {
        onChange(debouncedValue);
    }, [debouncedValue]);

    const inputClassName = {
        'is-invalid': !valid
    }
    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        let valid = true;
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const re = new RegExp(ev.target.value, 'i');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            valid = false;
        }
        setValid(valid);
        setValue(ev.target.value);
    }

    return (
        <InputGroup size={size}>
            <InputGroup.Text as="label" htmlFor={_id} aria-label={label ?? "Search"}>
                <span className={icon || 'bi-search'} aria-hidden="true"/>
            </InputGroup.Text>
            <FormControl type={type} className={classNames(inputClassName, className)} id={_id}
                         defaultValue={value} onChange={changeHandler}
                         placeholder={placeholder || "Search"}
                         {...rest}/>
        </InputGroup>
    )
}

export default SearchInput;
