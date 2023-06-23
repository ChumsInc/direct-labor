import React from 'react';
import {useParams} from "react-router-dom";
import {ErrorBoundary} from "react-error-boundary";
import StepsList from "../ducks/dlSteps/StepsList";
import SelectedDLStep from "../ducks/dlSteps/SelectedDLStep";

interface DLStepsMatchProps {
    id?: string,
}

const DirectLaborStepsContent = () => {
    const {id} = useParams<'id'>();

    return (
        <div className="row g-3">
            <div className="col-6">
                <ErrorBoundary fallback={<div>Error in StepsList.</div>}>
                    <StepsList/>
                </ErrorBoundary>
            </div>
            <div className="col-6">
                <ErrorBoundary fallback={<div>Error in SelectedDLStep</div>}>
                    <SelectedDLStep id={Number(id)} />
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default DirectLaborStepsContent;
