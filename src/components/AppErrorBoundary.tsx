import React from 'react';
import {Alert} from "react-bootstrap";
import {ErrorBoundary as ReactErrorBoundary, type FallbackProps} from 'react-error-boundary';

function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
    console.trace(error);
    return (
        <Alert variant="warning" dismissible={true} onClose={() => resetErrorBoundary()}>
            <strong>Sorry! Something went wrong.</strong>
            <div className="text-danger" style={{whiteSpace: 'pre-wrap'}}>{error.message}</div>
        </Alert>
    )
}

export default function AppErrorBoundary({children}: {
    children: React.ReactNode;
}) {
    return (
        <ReactErrorBoundary FallbackComponent={ErrorFallback}>
            {children}
        </ReactErrorBoundary>
    )
}
