import {useAppDispatch} from "@/app/configureStore.ts";
import {type FocusEvent, type FormEvent, useId, useRef, useState} from "react";
import {updateTimingEntry} from "@/ducks/timings/actions.ts";
import TimeInput from "@/components/direct-labor-steps/timing/TimeInput.tsx";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";

export default function AddNewTimingEntry() {
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [time, setTime] = useState<number | string>(0);
    const id = useId();

    const onAddValue = (ev: FormEvent) => {
        ev.preventDefault();
        if (time) {
            dispatch(updateTimingEntry({index: null, value: time}));
        }
        setTime(0);
        inputRef.current?.focus();
    }

    const focusHandler = (ev: FocusEvent<HTMLInputElement>) => {
        ev.target.select();
    }

    return (
        <Row as={Form} className="g-3 align-content-center" onSubmit={onAddValue}>
            <Form.Label column={true} xs={3} htmlFor={id}>New Entry</Form.Label>
            <Col xs="auto">
                <InputGroup>
                    <InputGroup.Text as="label" htmlFor={id}>Add Timing</InputGroup.Text>
                    <TimeInput value={time || ''} onChange={setTime}
                               inputProps={{id: id, onFocus: focusHandler}}
                               ref={inputRef}>
                    </TimeInput>
                    <Button type="submit" variant="outline-secondary">
                        <span className="bi-plus-lg" aria-label="Add Timing"/>
                    </Button>
                </InputGroup>
            </Col>
        </Row>
    )
}
