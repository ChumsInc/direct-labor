import React from 'react';
import {ProgressBar, ProgressBarProps} from "react-bootstrap";

export interface AnimatedLoadingBarProps extends ProgressBarProps {
    loading?: boolean;
}

const AnimatedLoadingBar = ({loading, ...props}: AnimatedLoadingBarProps) => {
    if (!loading) {
        return null;
    }
    return (
        <ProgressBar animated striped style={{height: '5px'}} {...props} />
    )
}

export default AnimatedLoadingBar;
