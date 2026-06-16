import Icon, {type IconProps} from "@/components/icons/Icon.tsx";
import classNames from "classnames";

export default function InfoIcon({className, ...props}:IconProps) {
    return (
        <Icon className={classNames(`bi-info-circle`, className)} {...props}/>
    )
}
