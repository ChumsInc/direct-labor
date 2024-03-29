import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {loadOperationCodes, selectLoaded, selectLoading} from "../ducks/operationCodes";
import {ErrorBoundary} from "chums-ducks";
import OperationCodeFilter from "../ducks/operationCodes/OperationCodeFilter";
import OperationCodeList from "../ducks/operationCodes/OperationCodeList";
import SelectedOperationCode from "../ducks/operationCodes/SelectedOperationCode";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useAppDispatch} from "../app/configureStore";

interface OperationCodeMatchProps {
    workCenter?: string,
    operationCode?: string,
}

const OperationCodesContent: React.FC<RouteComponentProps> = ({match}) => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectLoaded);
    const loading = useSelector(selectLoading);
    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadOperationCodes());
        }
    }, [])

    const {workCenter, operationCode} = match.params as OperationCodeMatchProps;
    return (
        <>
            <Helmet>
                <title>D/L OpCodes</title>
            </Helmet>
            <div className="row g-5">
                <div className="col-6">
                    <ErrorBoundary>
                        <OperationCodeFilter/>
                        <OperationCodeList tableKey={'operation-code-list'}/>
                    </ErrorBoundary>
                </div>
                <div className="col-6">
                    <ErrorBoundary>
                        <SelectedOperationCode workCenter={workCenter} operationCode={operationCode}/>
                    </ErrorBoundary>
                </div>
            </div>
        </>
    )
}
export default OperationCodesContent;
