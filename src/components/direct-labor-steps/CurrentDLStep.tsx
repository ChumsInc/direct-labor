import {useEffect} from "react";
import {useSelector} from "react-redux";
import {selectCurrentStep, selectCurrentStepStatus} from "@/ducks/dlSteps";
import {loadDLStep, loadDLStepWhereUsed, setCurrentStep} from "@/ducks/dlSteps/actions.ts";
import SelectedStepTimings from "@/components/direct-labor-steps/timing/SelectedStepTimings.tsx";
import DLStepForm from "@/components/direct-labor-steps/form/DLStepForm.tsx";
import {useAppDispatch} from "@/app/configureStore.ts";
import {useParams} from "react-router";
import {newDLStep} from "@/ducks/dlSteps/utils.ts";
import {Col, ProgressBar, Row, Stack} from "react-bootstrap";
import DocumentTitle from "@/components/common/DocumentTitle.tsx";


export default function CurrentDLStep() {
    const dispatch = useAppDispatch();
    const params = useParams<{ id: string }>()
    const step = useSelector(selectCurrentStep);
    const status = useSelector(selectCurrentStepStatus);


    useEffect(() => {
        if (!params.id) {
            return;
        }
        if (params.id === '0') {
            dispatch(setCurrentStep(newDLStep));
            return;
        }
        dispatch(loadDLStep(params.id))
        dispatch(loadDLStepWhereUsed(params.id));
    }, [dispatch, params]);

    return (
        <div>
            <DocumentTitle>{`D/L Step: ${step?.stepCode ?? 'new'}`}</DocumentTitle>
            <Stack gap={5} direction="horizontal" className="align-items-baseline">
                <h2>Step Editor: <strong>{step?.stepCode}</strong></h2>
                <div className="text-secondary">
                    {step?.description && <h3>{step?.description}</h3>}
                </div>
            </Stack>
            <Row className="g-5">
                <Col xs="6">
                    <div style={{height: '5px'}}>
                        {status !== 'idle' && <ProgressBar animated striped now={100} style={{height: '100%'}}/>}
                    </div>
                    <DLStepForm/>
                </Col>
                <Col xs="6">
                    <h3>Step Timings</h3>
                    <SelectedStepTimings/>
                </Col>
            </Row>

        </div>
    )
}
