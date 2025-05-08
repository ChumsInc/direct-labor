import React, {useEffect} from 'react';
import {HashRouter, Route, Routes} from 'react-router';
import RoutingPage from "../ducks/routing/RoutingPage";
import WorkCenterPage from "../ducks/workCenters/WorkCenterPage";
import OperationCodesPage from "../ducks/operationCodes/OperationCodesPage";
import DirectLaborCodesPage from "../ducks/dlCodes/DirectLaborCodesPage";
import DirectLaborStepsPage from "../ducks/dlSteps/DirectLaborStepsPage";
import MainOutlet from "./MainOutlet";
import SelectedDLStep from "../ducks/dlSteps/SelectedDLStep";
import CurrentDLCode from "../ducks/dlCodes/CurrentDLCode";
import RoutingInfo from "../ducks/routing/RoutingInfo";
import WorkCenterForm from "../ducks/workCenters/WorkCenterForm";
import SelectedOperationCode from "../ducks/operationCodes/SelectedOperationCode";
import ActivityCodesPage from "./activity-codes/ActivityCodesPage";
import CurrentActivityCode from "./activity-codes/CurrentActivityCode";
import {useAppDispatch} from "@/app/configureStore";
import {loadWorkCenters} from "@/ducks/workCenters/actions";
import {loadActivityCodes} from "@/ducks/activity-codes/actions";
import {loadDLCodes} from "@/ducks/dlCodes/actions";
import {loadDLSteps} from "@/ducks/dlSteps/actions";
import TemplatesPage from "./TemplatesPage";
import CurrentTemplate from "../ducks/templates/CurrentTemplate";
import Alert from "react-bootstrap/Alert";
import Redirect from "@/components/common/Redirect";
import "./app-styles.scss"

const App = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadWorkCenters());
        dispatch(loadActivityCodes());
        dispatch(loadDLCodes());
        dispatch(loadDLSteps());
    }, []);

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<MainOutlet/>}>
                    <Route index element={<Redirect to="dl-steps"/>}/>
                    <Route path="dl-steps" element={<DirectLaborStepsPage/>}>
                        <Route path=":id" element={<SelectedDLStep/>}/>
                    </Route>
                    <Route path="dl-codes" element={<DirectLaborCodesPage/>}>
                        <Route path=":id" element={<CurrentDLCode/>}/>
                    </Route>
                    <Route path="work-centers" element={<WorkCenterPage/>}>
                        <Route path=":workCenter" element={<WorkCenterForm/>}/>
                    </Route>
                    <Route path="activity-codes" element={<ActivityCodesPage />}>
                        <Route path=":workCenter/:activityCode" element={<CurrentActivityCode />} />
                    </Route>
                    <Route path="templates" element={<TemplatesPage/>}>
                        <Route path=":templateNo/:revisionNo" element={<CurrentTemplate/>}/>
                    </Route>
                    <Route path="routing" element={<RoutingPage/>}>
                        <Route path=":routingNo" element={<RoutingInfo/>}/>
                    </Route>
                    <Route path="operation-codes" element={<OperationCodesPage/>}>
                        <Route path=":workCenter/:operationCode" element={<SelectedOperationCode/>}/>
                    </Route>
                    <Route path="*" element={<Alert variant="danger">Path not found</Alert>}/>
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default App;
