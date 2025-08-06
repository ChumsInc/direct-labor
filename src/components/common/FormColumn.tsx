import classNames from "classnames";
import {type ReactNode, useId} from "react";
import {Col, FormLabel, type FormLabelProps, Row,} from "react-bootstrap";

export interface FormColumnProps {
    id?: string;
    label: string | ReactNode;
    labelProps?: FormLabelProps;
    width?: number;
    className?: string;
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    children?: ReactNode;
}


const FormColumn = ({
                        label,
                        labelProps,
                        width = 8,
                        className,
                        align = 'baseline',
                        children
                    }: FormColumnProps) => {
    const _id = useId();
    const id = labelProps?.htmlFor ?? _id;
    const labelWidth = 12 - (width ?? 8);
    const parentClassName = {
        [`align-items-${align}`]: !className?.includes('align-items') && !!align,
    }

    return (
        <Row className={classNames('g-3', parentClassName, className)}>
            <FormLabel column xs={labelWidth} id={id} {...labelProps}>{label}</FormLabel>
            <Col xs={width} aria-describedby={id}>
                {children}
            </Col>
        </Row>
    )
}

export default FormColumn;
