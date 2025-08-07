import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectCurrentTiming} from "@/ducks/timings/selectors.ts";
import {updateTimingEntry} from "@/ducks/timings/actions.ts";
import Decimal from "decimal.js";
import classNames from "classnames";
import {Button, Col, InputGroup, Row} from "react-bootstrap";
import TimeInput from "@/components/direct-labor-steps/timing/TimeInput.tsx";

export default function TimingEntryList() {
    const dispatch = useAppDispatch();
    const timing = useSelector(selectCurrentTiming);

    const changeHandler = (index: number) => (value: number | string) => {
        dispatch(updateTimingEntry({index, value}));
    }

    const removeTiming = (index: number) => {
        dispatch(updateTimingEntry({index, value: null}))
    }

    const iconClassName = (value: string | number) => {
        const pct = new Decimal(timing?.avgTiming ?? 0).eq(0)
            ? new Decimal(0)
            : new Decimal(timing?.avgTiming ?? 0).sub(value).div(timing?.avgTiming ?? 1);
        return classNames(
            {
                'bi-exclamation-triangle-fill text-warning': pct.abs().greaterThanOrEqualTo(0.25),
                'bi-check-lg text-success': pct.abs().lt(0.25),
                [`pct--${pct.abs().toDecimalPlaces(3)}`]: true,
            }
        )
    }

    return (
        <Row className="g-3 mb-3">
            {timing?.entries.map((entry: string | number, index: number) => (
                <Col xs="auto" key={index}>
                    <InputGroup size="sm">
                        <InputGroup.Text><span className={iconClassName(entry)}/></InputGroup.Text>
                        <TimeInput value={entry} onChange={changeHandler(index)}/>
                        <Button type="button" variant="outline-secondary"
                                onClick={() => removeTiming(index)}>
                            <span className="bi-x"/>
                        </Button>
                    </InputGroup>
                </Col>
            ))}
        </Row>
    )
}
