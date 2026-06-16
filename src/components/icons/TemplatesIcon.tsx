import Icon, {type IconProps} from "@/components/icons/Icon.tsx";
import classNames from "classnames";

export default function TemplatesIcon({className, ...props}:IconProps) {
    return (
        <Icon className={classNames(`bi-card-list`, className)} {...props}/>
    )
}
