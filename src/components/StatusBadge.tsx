import React from "react";
import Badge from "react-bootstrap/Badge";
import {Variant} from "react-bootstrap/types";

interface StatusBadgeProps {
    status: boolean,
    className?: string,
    trueColor?: Variant,
    falseColor?: Variant,
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
    return (<Badge bg={color} className={className}>{status ? trueValue : falseValue}</Badge>)
}

export default StatusBadge;
