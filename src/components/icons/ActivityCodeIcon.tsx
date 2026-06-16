import Icon, {type IconProps} from "@/components/icons/Icon.tsx";
import classNames from "classnames";

export default function ActivityCodeIcon({className, ...props}:IconProps) {
    return (
        <Icon className={classNames(`bi-activity`, className)} {...props}/>
    )
}
