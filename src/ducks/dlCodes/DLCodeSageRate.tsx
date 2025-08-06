import {useId} from 'react';
import {Col, FormControl, InputGroup} from "react-bootstrap";
import {useAppSelector} from "@/app/configureStore";
import {selectCurrentDLSageRate} from "./selectors";

export default function DLCodeSageRate() {
    const rateProps = useAppSelector(selectCurrentDLSageRate);
    const idLaborRate = useId();
    const idLaborScalingQuantity = useId();

    return (
        <>
        <Col>
            <InputGroup size="sm">
                <InputGroup.Text as="label" htmlFor={idLaborRate}>Labor Rate</InputGroup.Text>
                <FormControl type="text" id={idLaborRate}
                             value={rateProps?.averageHourlyRate ?? ''}
                             className="text-end"
                             readOnly/>
            </InputGroup>
        </Col>
        <Col>
            <InputGroup size="sm">
                <InputGroup.Text as="label" htmlFor={idLaborScalingQuantity}>Labor Scaling Quantity</InputGroup.Text>
                <FormControl type="text" id={idLaborScalingQuantity}
                             value={rateProps?.scalingFactorLabor ?? ''}
                             className="text-end"
                       readOnly/>
            </InputGroup>
        </Col>
        </>
    )
}
