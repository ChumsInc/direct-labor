import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {loadOperationCodes, selectLoaded, selectLoading} from "../ducks/operationCodes";
import {ErrorBoundary} from "react-error-boundary";
import OperationCodeFilter from "../ducks/operationCodes/OperationCodeFilter";
import OperationCodeList from "../ducks/operationCodes/OperationCodeList";
import SelectedOperationCode from "../ducks/operationCodes/SelectedOperationCode";
import {useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useAppDispatch} from "../app/configureStore";

interface OperationCodeMatchProps {
    workCenter?: string,
    operationCode?: string,
}

const OperationCodesContent = () => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectLoaded);
    const loading = useSelector(selectLoading);
    const {workCenter, operationCode} = useParams<'workCenter'|'operationCode'>()
    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadOperationCodes());
        }
    }, [])

    return (
        <>
            <Helmet>
                <title>D/L OpCodes</title>
            </Helmet>
            <div className="row g-5">
                <div className="col-6">
                    <ErrorBoundary fallback={<div>Yikes... something failed.</div>}>
                        <OperationCodeFilter/>
                        <OperationCodeList tableKey={'operation-code-list'}/>
                    </ErrorBoundary>
                </div>
                <div className="col-6">
                    <ErrorBoundary fallback={<div>Fucking hell... something failed.</div>}>
                        <SelectedOperationCode workCenter={workCenter} operationCode={operationCode}/>
                    </ErrorBoundary>
                </div>
            </div>
        </>
    )
}
export default OperationCodesContent;
