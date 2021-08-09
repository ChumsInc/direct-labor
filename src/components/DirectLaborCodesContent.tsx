import React from 'react';
import {RouteComponentProps} from "react-router-dom";

interface DLCodesMatchProps {
    dlCode?: string,
}
const DirectLaborCodesContent:React.FC<RouteComponentProps> = ({match}) => {
    const {dlCode} = match.params as DLCodesMatchProps;

    return (
        <>
            <small>DL Codes Content</small>
        </>
    )
}

export default DirectLaborCodesContent;
