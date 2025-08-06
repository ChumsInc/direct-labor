import classNames from "classnames";
import numeral from "numeral";
import Decimal from "decimal.js";

const NumericTableValue = ({value, format}: { value: string | number | null | undefined, format?: string }) => {
    if (value === null || typeof value === 'undefined') {
        return null;
    }
    const className = classNames({
        'text-secondary': new Decimal(value).eq('0'),
    });
    return <span className={className}>{numeral(value).format(format)}</span>
}

export default NumericTableValue;
