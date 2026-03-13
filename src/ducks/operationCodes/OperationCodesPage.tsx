import {useEffect} from "react";
import {loadOperationCodes} from "./actions";
import OperationCodeFilter from "./OperationCodeFilter";
import OperationCodeList from "./OperationCodeList";
import {Link, Outlet} from "react-router";
import {useAppDispatch} from "@/app/configureStore";
import {Alert} from "react-bootstrap";
import DocumentTitle from "@/components/common/DocumentTitle";

const OperationCodesPage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadOperationCodes());
    }, [dispatch])

    return (
        <div className="container-fluid">
            <DocumentTitle>D/L OpCodes</DocumentTitle>
            <Alert variant="danger">
                <strong className="me-1">Note:</strong> These values are for reference only. For current values
                see <Link to="/activity-codes" className="ms-1">Activity Codes</Link>
            </Alert>
            <div className="row g-5">
                <div className="col-6">
                    <OperationCodeFilter/>
                    <OperationCodeList/>
                </div>
                <div className="col-6">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}
export default OperationCodesPage;
