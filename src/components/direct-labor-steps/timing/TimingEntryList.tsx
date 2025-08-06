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
        const outside20Pct = new Decimal(timing?.avgTiming ?? 0).sub(value).abs().times(5);
        return classNames(
            {
                'bi-exclamation-triangle-fill text-warning': outside20Pct.gt(timing?.avgTiming ?? 0),
                'bi-check-lg text-success': outside20Pct.lte(timing?.avgTiming ?? 0),
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
