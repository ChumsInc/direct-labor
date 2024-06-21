import React from 'react';
import {LoadingProgressBar} from "chums-components";

export interface AnimatedLoadingBarProps {
    loading?: boolean;
}

const AnimatedLoadingBar = ({loading}:AnimatedLoadingBarProps) => {
    if (!loading) {
        return null;
    }
    return (
        <LoadingProgressBar animated striped style={{height: '5px'}} />
    )
}

export default AnimatedLoadingBar;
