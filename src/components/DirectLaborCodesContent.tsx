import React from 'react';
import {useParams} from "react-router-dom";
import DLCodeFilter from "../ducks/dlCodes/DLCodeFilter";
import {ErrorBoundary} from "react-error-boundary";
import SelectedDLCode from "../ducks/dlCodes/SelectedDLCode";
import MainDLCodeList from "../ducks/dlCodes/MainDLCodeList";

interface DLCodesMatchProps {
    id?: string,
}

const DirectLaborCodesContent = () => {
    const {id} = useParams<'id'>()

    return (
        <div className="row g-3">
            <div className="col-6">
                <DLCodeFilter/>
                <MainDLCodeList tableKey={'dl-main-list'}/>
            </div>
            <div className="col-6">
                <ErrorBoundary fallback={<div>Error in SelectedDLCode</div>}>
                    <SelectedDLCode id={Number(id)}/>
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default DirectLaborCodesContent;
