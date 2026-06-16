import Icon, {type IconProps} from "@/components/icons/Icon.tsx";
import classNames from "classnames";

export default function SageOperationCodeIcon({className, ...props}:IconProps) {
    return (
        <Icon className={classNames(`bi-currency-dollar`, className)} {...props}/>
    )
}
