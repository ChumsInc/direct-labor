import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import DLCodeList from "../ducks/dlCodes/DLCodeList";

interface DLCodesMatchProps {
    dlCode?: string,
}
const DirectLaborCodesContent:React.FC<RouteComponentProps> = ({match}) => {
    const {dlCode} = match.params as DLCodesMatchProps;

    return (
        <>
            <DLCodeList tableKey={'dl-main-list'} />
        </>
    )
}

export default DirectLaborCodesContent;
