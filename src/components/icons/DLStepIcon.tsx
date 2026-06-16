import Icon, {type IconProps} from "@/components/icons/Icon.tsx";
import classNames from "classnames";

export default function DLStepIcon({className, ...props}:IconProps) {
    return (
        <Icon className={classNames(`bi-gear-wide-connected`, className)} {...props}/>
    )
}
