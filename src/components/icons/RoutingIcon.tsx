import Icon, {type IconProps} from "./Icon.tsx";
import classNames from "classnames";

export default function RoutingIcon({
                                        className,
                                        ...props
                                    }: IconProps) {
    return (
        <Icon className={classNames('bi-signpost-split-fill', className)} {...props}/>
    )
}
