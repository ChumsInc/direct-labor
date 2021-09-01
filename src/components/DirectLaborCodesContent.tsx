import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import DLCodeFilter from "../ducks/dlCodes/DLCodeFilter";
import {ErrorBoundary} from "chums-ducks";
import SelectedDLCode from "../ducks/dlCodes/SelectedDLCode";
import MainDLCodeList from "../ducks/dlCodes/MainDLCodeList";

interface DLCodesMatchProps {
    id?: string,
}

const DirectLaborCodesContent: React.FC<RouteComponentProps> = ({match}) => {
    const {id} = match.params as DLCodesMatchProps;

    return (
        <div className="row g-3">
            <div className="col-6">
                <DLCodeFilter/>
                <MainDLCodeList tableKey={'dl-main-list'}/>
            </div>
            <div className="col-6">
                <ErrorBoundary>
                    <SelectedDLCode id={Number(id)}/>
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default DirectLaborCodesContent;
