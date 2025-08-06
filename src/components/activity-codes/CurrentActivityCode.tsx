import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentActivityCode} from "@/ducks/activity-codes/selectors";
import {useParams} from "react-router";
import {setCurrentActivityCode} from "@/ducks/activity-codes/actions";
import CurrentActivitySteps from "./CurrentActivitySteps";
import CurrentActivityDLCodes from "./CurrentActivityDLCodes";
import dayjs from "dayjs";
import {Card, Col, Form, Row} from "react-bootstrap";

const CurrentActivityCode = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentActivityCode);
    const params = useParams<"workCenter" | "activityCode">()

    useEffect(() => {
        if (params.workCenter && params.activityCode) {
            dispatch(setCurrentActivityCode({WorkCenter: params.workCenter, ActivityCode: params.activityCode}));
        }
    }, [params]);

    return (
        <div>
            <Card className="mb-5">
                <Card.Header>
                    {current?.WorkCenter}/{current?.ActivityCode}
                </Card.Header>
                <Card.Body className="card-body">
                    <Card.Title>
                        <h3>{current?.ActivityDesc}</h3>
                    </Card.Title>
                    <Form.Group as={Row} label="Scrap Account">
                        <Form.Label column sm={4}>Scrap Account</Form.Label>
                        <Col>
                            <strong className="me-3">{current?.ScrapAccount?.Account}</strong>
                            <span className="text-secondary">{current?.ScrapAccount?.AccountDesc}</span>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} label="Updated">
                        <Form.Label column sm={4}>Updated</Form.Label>
                        <Col>
                            {dayjs(current?.updated).isValid() && (
                                <span
                                    className="text-secondary">{dayjs(current?.updated).format('MM/DD/YYYY HH:mm')}</span>
                            )}
                        </Col>
                    </Form.Group>
                </Card.Body>
            </Card>
            <CurrentActivityDLCodes/>
            <CurrentActivitySteps/>
        </div>
    )
}

export default CurrentActivityCode
