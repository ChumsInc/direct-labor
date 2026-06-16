import Icon, {type IconProps} from "@/components/icons/Icon.tsx";
import classNames from "classnames";

export default function EditIcon({className, ...props}:IconProps) {
    return (
        <Icon className={classNames(`bi-pencil`, className)} {...props}/>
    )
}
