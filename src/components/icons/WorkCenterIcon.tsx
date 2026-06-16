import Icon, {type IconProps} from "@/components/icons/Icon.tsx";
import classNames from "classnames";

export default function WorkCenterIcon({className, ...props}:IconProps) {
    return (
        <Icon className={classNames(`bi-house-door-fill`, className)} {...props}/>
    )
}
