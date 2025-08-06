import {ProgressBar, type ProgressBarProps} from "react-bootstrap";

export interface AnimatedLoadingBarProps extends ProgressBarProps {
    loading?: boolean;
}

const AnimatedLoadingBar = ({loading, ...props}: AnimatedLoadingBarProps) => {
    if (!loading) {
        return null;
    }
    return (
        <ProgressBar animated striped style={{height: '5px'}} now={100} {...props} />
    )
}

export default AnimatedLoadingBar;
