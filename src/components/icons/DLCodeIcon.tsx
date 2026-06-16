import Icon, {type IconProps} from "@/components/icons/Icon.tsx";
import classNames from "classnames";

export default function DLCodeIcon({className, ...props}:IconProps) {
    return (
        <Icon className={classNames(`bi-diagram-3-fill`, className)} {...props}/>
    )
}
