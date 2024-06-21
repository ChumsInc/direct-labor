import React from 'react';
import {Alert} from "chums-components";
import {ErrorBoundary as ReactErrorBoundary, FallbackProps} from 'react-error-boundary';

function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
    console.trace(error);
    return (
        <Alert color="warning">
            <strong>Sorry! Something went wrong.</strong>
            <div className="text-danger" style={{whiteSpace: 'pre-wrap'}}>{error.message}</div>
        </Alert>
    )
}

export default function ErrorBoundary({children}: {
    children: React.ReactNode;
}) {

    return (
        <ReactErrorBoundary FallbackComponent={ErrorFallback}>
            {children}
        </ReactErrorBoundary>
    )
}
