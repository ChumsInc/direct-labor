import React from "react";
import {Badge, BootstrapBGColor} from "chums-ducks";

interface StatusBadgeProps {
    status: boolean,
    className?: string,
    trueColor?: BootstrapBGColor,
    falseColor?: BootstrapBGColor,
    trueValue?: string,
    falseValue?: string,
}

const StatusBadge:React.FC<StatusBadgeProps> = ({
                                                    status,
    className,
                                                    trueColor= 'success',
                                                    falseColor= 'danger',
                                                    trueValue= 'Y',
                                                    falseValue = 'N'}) => {
    const color = status ? trueColor : falseColor;
    return (<Badge color={color} className={className}>{status ? trueValue : falseValue}</Badge>)
}

export default StatusBadge;
