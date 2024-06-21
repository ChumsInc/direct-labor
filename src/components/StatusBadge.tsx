import React from "react";
import {Badge, BootstrapBGColor} from "chums-components";

interface StatusBadgeProps {
    status: boolean,
    className?: string,
    trueColor?: BootstrapBGColor,
    falseColor?: BootstrapBGColor,
    trueValue?: string,
    falseValue?: string,
}

const StatusBadge = ({
                         status,
                         className,
                         trueColor = 'success',
                         falseColor = 'danger',
                         trueValue = 'Y',
                         falseValue = 'N'
                     }: StatusBadgeProps) => {
    const color = status ? trueColor : falseColor;
    return (<Badge color={color} className={className}>{status ? trueValue : falseValue}</Badge>)
}

export default StatusBadge;
