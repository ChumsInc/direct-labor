import React, {ChangeEvent, useId, useState} from "react";
import {Input} from "chums-components";
import {InputProps} from "chums-components";
import classNames from "classnames";

export interface SearchInputProps extends InputProps {
    icon?: string,
}

const SearchInput = ({
                                                     value,
                                                     icon,
                                                     bsSize,
                                                     type = 'search',
                                                     placeholder,
                                                     className,
                                                     onChange,
    id,
                                                     ...rest
                                                 }:SearchInputProps) => {
    const [valid, setValid] = useState(true);
    const _id = id ?? useId();

    const groupClassName = {
        'input-group': true,
        [`input-group-${bsSize}`]: !!bsSize,

    }
    const inputClassName = {
        'form-control': true,
        'is-invalid': !valid
    }
    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        let valid = true;
        try {
            const re = new RegExp(ev.target.value, 'i');
        } catch (err) {
            valid = false;
        }
        setValid(valid);
        if (!!onChange) {
            onChange(ev);
        }
    }

    return (
        <div className={classNames(groupClassName)}>
            <label className="input-group-text" htmlFor={_id}  aria-label="Search">
                <span className={icon || 'bi-search'}/>
            </label>
            <Input type={type} className={classNames(inputClassName, className)}
                   id={_id}
                   placeholder={placeholder || "Search"}
                   value={value} onChange={changeHandler} {...rest}/>
        </div>
    )
}

export default SearchInput;
