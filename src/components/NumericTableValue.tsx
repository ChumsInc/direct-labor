import React from 'react';
import classNames from "classnames";
import numeral from "numeral";

const NumericTableValue = ({value, format}:{value: string|number|null, format?:string}) => {
    if (value === null) {
        return null;
    }
    const className = classNames({
        'text-muted': !value || value === '0',
    });
    return <span className={className}>{numeral(value).format(format)}</span>
}

export default NumericTableValue;
