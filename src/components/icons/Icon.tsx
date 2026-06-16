import type {HTMLAttributes} from "react";

export type IconProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export default function Icon({className, ...props}:IconProps) {
    return (
        <span className={`${className}`} {...props} />
    )
}
