import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadedSelector, loadingSelector} from "../ducks/operationCodes";
import {ErrorBoundary} from "chums-ducks";
import OperationCodeFilter from "../ducks/operationCodes/OperationCodeFilter";
import OperationCodeList from "../ducks/operationCodes/OperationCodeList";
import {loadOperationCodesAction} from "../ducks/operationCodes/actions";
import SelectedOperationCode from "../ducks/operationCodes/SelectedOperationCode";

const OperationCodesContent: React.FC = () => {
    const dispatch = useDispatch();
    const loaded = useSelector(loadedSelector);
    const loading = useSelector(loadingSelector);
    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadOperationCodesAction());
        }
    }, [])

    return (
        <div className="row g-3">
            <div className="col-6">
                <ErrorBoundary>
                    <OperationCodeFilter/>
                    <OperationCodeList tableKey={'operation-code-list'}/>
                </ErrorBoundary>
            </div>
            <div className="col-6">
                <ErrorBoundary>
                    <SelectedOperationCode />
                </ErrorBoundary>
            </div>
        </div>
    )
}
export default OperationCodesContent;
