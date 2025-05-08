import React from 'react';
import {AlertProps} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";


export interface ContextAlertProps extends AlertProps {
    context?: string;
    count?: number;
    children?: React.ReactNode;
}

export default function ContextAlert({context, count, children, ...props}: ContextAlertProps) {
    return (
        <Alert variant="warning" {...props}>
            {!!context && (
                <Alert.Heading>
                    {context}
                    {!!count && count > 1 && (<Badge bg={props.variant}>{count}</Badge>)}
                </Alert.Heading>
            )}
            {children}
        </Alert>
    )
}
