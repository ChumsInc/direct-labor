import Icon, {type IconProps} from "@/components/icons/Icon.tsx";
import classNames from "classnames";

export default function DLTimingIcon({className, ...props}:IconProps) {
    return (
        <Icon className={classNames(`bi-card-text`, className)} {...props}/>
    )
}
