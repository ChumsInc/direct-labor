import React from 'react';
import {Outlet} from "react-router";
import StepsList from "./StepsList";
import DLStepsFilter from "./DLStepsFilter";
import {Col, Row} from "react-bootstrap";

const DirectLaborStepsPage = () => {
    return (
        <>
            <title>D/L Steps</title>
            <Row className="g-3">
                <Col xs={6}>
                    <DLStepsFilter/>
                    <StepsList/>
                </Col>
                <Col xs={6}>
                    <Outlet/>
                </Col>
            </Row>
        </>
    )
}

export default DirectLaborStepsPage;
