import React, {ChangeEvent, useState} from "react";
import {Input} from "chums-ducks";
import {InputProps} from "chums-ducks/dist/components/Input";
import classNames from "classnames";

export interface SearchInputProps extends InputProps {
    icon?: string,
}

const SearchInput: React.FC<SearchInputProps> = ({
                                                     value,
                                                     icon,
                                                     bsSize,
                                                     type = 'search',
                                                     placeholder,
                                                     className,
                                                     onChange,
                                                     ...rest
                                                 }) => {
    const [valid, setValid] = useState(true);

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
            <div className="input-group-text"><span className={icon || 'bi-search'}/></div>
            <Input type={type} className={classNames(inputClassName, className)}
                   placeholder={placeholder || "Search"}
                   value={value} onChange={changeHandler} {...rest}/>
        </div>
    )
}

export default SearchInput;
