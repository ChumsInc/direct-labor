import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {selectLoaded, selectLoading} from "./selectors";
import {loadOperationCodes} from "./actions";
import OperationCodeFilter from "./OperationCodeFilter";
import OperationCodeList from "./OperationCodeList";
import {Link, Outlet} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useAppDispatch} from "../../app/configureStore";
import {Alert} from "chums-components";

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
            <Alert color="danger"><strong>Note:</strong> These values are for reference only. For current values see <Link to="/activity-codes">Activity Codes</Link></Alert>
            <div className="row g-5">
                <div className="col-6">
                    <OperationCodeFilter/>
                    <OperationCodeList/>
                </div>
                <div className="col-6">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}
export default OperationCodesPage;
