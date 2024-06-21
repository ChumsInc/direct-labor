import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {selectLoaded, selectLoading} from "../ducks/operationCodes/selectors";
import {loadOperationCodes} from "../ducks/operationCodes/actions";
import ErrorBoundary from "./ErrorBoundary";
import OperationCodeFilter from "../ducks/operationCodes/OperationCodeFilter";
import OperationCodeList from "../ducks/operationCodes/OperationCodeList";
import {Outlet} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useAppDispatch} from "../app/configureStore";

interface OperationCodeMatchProps {
    workCenter?: string,
    operationCode?: string,
}

const OperationCodesPage = () => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectLoaded);
    const loading = useSelector(selectLoading);
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
                    <OperationCodeFilter/>
                    <OperationCodeList tableKey={'operation-code-list'}/>
                </div>
                <div className="col-6">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}
export default OperationCodesPage;
