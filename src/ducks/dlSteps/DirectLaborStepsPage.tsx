import {Outlet, useParams} from "react-router";
import StepsList from "./StepsList";
import DLStepsFilter from "./DLStepsFilter";
import {Col, Row} from "react-bootstrap";
import classNames from "classnames";
import Alert from "react-bootstrap/Alert";

const DirectLaborStepsPage = () => {
    const params = useParams<'id'>();
    return (
        <Row className="g-5">
            <Col xs={12} lg={7} className={classNames('d-lg-block', {'d-none': params.id})} >
                <DLStepsFilter/>
                <StepsList/>
            </Col>
            <Col xs={12} lg={5}>
                {!params.id && (
                    <div className="d-none d-lg-block">
                        <Alert variant="info">Select a Direct Labor Step</Alert>
                    </div>
                )}
                <Outlet/>
            </Col>
        </Row>
    )
}

export default DirectLaborStepsPage;
