import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import {ErrorBoundary} from "chums-ducks";
import StepsList from "../ducks/dlSteps/StepsList";
import SelectedDLStep from "../ducks/dlSteps/SelectedDLStep";

interface DLStepsMatchProps {
    id?: string,
}

const DirectLaborStepsContent: React.FC<RouteComponentProps> = ({match}) => {
    const {id} = match.params as DLStepsMatchProps;

    return (
        <div className="row g-3">
            <div className="col-6">
                <ErrorBoundary>
                    <StepsList/>
                </ErrorBoundary>
            </div>
            <div className="col-6">
                <ErrorBoundary>
                    <SelectedDLStep id={Number(id)} />
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default DirectLaborStepsContent;
