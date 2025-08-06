import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentStep, selectCurrentStepStatus} from "./index";
import {loadDLStep, loadDLStepWhereUsed, setCurrentStep} from "./actions";
import SelectedStepTimings from "../timings/SelectedStepTimings";
import DLStepForm from "./DLStepForm";
import SelectedWhereUsedList from "./SelectedWhereUsedList";
import {useAppDispatch} from "@/app/configureStore";
import {useParams} from "react-router";
import {newDLStep} from "./utils";
import {ProgressBar} from "react-bootstrap";
import StepTabs from "@/ducks/dlSteps/StepTabs";
import DocumentTitle from "@/components/common/DocumentTitle";

const tabID = {
    settings: 'settings',
    timings: 'timings',
    whereUsed: 'where-used',
}


const SelectedDLStep = () => {
    const dispatch = useAppDispatch();
    const params = useParams<{ id: string }>()
    const step = useSelector(selectCurrentStep);
    const status = useSelector(selectCurrentStepStatus);
    const [tab, setTab] = useState<string>(tabID.settings);


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
        <div data-component="SelectedDLStep">
            <DocumentTitle>{`D/L Step: ${step?.stepCode ?? 'new'}`}</DocumentTitle>
            <h2>Step Editor: <strong>{step?.stepCode}</strong></h2>
            {step?.description && <h3>{step?.description}</h3>}
            <StepTabs activeKey={tab} onChangeTab={setTab}/>
            <div style={{height: '5px'}}>
                {status !== 'idle' && <ProgressBar animated striped now={100} style={{height: '100%'}}/>}
            </div>
            {tab === tabID.settings && (
                <DLStepForm/>
            )}
            {tab === tabID.timings && (
                <SelectedStepTimings/>
            )}
            {tab === tabID.whereUsed && (
                <SelectedWhereUsedList/>
            )}
        </div>
    )
}
export default SelectedDLStep;
