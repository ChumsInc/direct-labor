import React from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import RoutingPage from "./RoutingPage";
import AlertList from "../ducks/alerts/AlertList";
import WorkCenterPage from "./WorkCenterPage";
import OperationCodesPage from "./OperationCodesPage";
import DirectLaborCodesPage from "./DirectLaborCodesPage";
import DirectLaborStepsPage from "./DirectLaborStepsPage";
import MainOutlet from "./MainOutlet";
import SelectedDLStep from "../ducks/dlSteps/SelectedDLStep";
import SelectedDLCode from "../ducks/dlCodes/SelectedDLCode";
import RoutingInfo from "../ducks/routing/RoutingInfo";
import WorkCenterForm from "../ducks/workCenters/WorkCenterForm";
import SelectedOperationCode from "../ducks/operationCodes/SelectedOperationCode";

const App: React.FC = () => {
    return (
        <HashRouter>
            <AlertList/>
            <Routes>
                <Route path="/" element={<MainOutlet/>}>
                    <Route path="dl-codes" element={<DirectLaborCodesPage/>}>
                        <Route path=":id" element={<SelectedDLCode/>}/>
                    </Route>
                    <Route path="dl-steps" element={<DirectLaborStepsPage/>}>
                        <Route path=":id" element={<SelectedDLStep/>}/>
                    </Route>
                    <Route path="operation-codes" element={<OperationCodesPage/>}>
                        <Route path=":workCenter/:operationCode" element={<SelectedOperationCode/>}/>
                    </Route>
                    <Route path="routing" element={<RoutingPage/>}>
                        <Route path=":routingNo" element={<RoutingInfo/>}/>
                    </Route>
                    <Route path="work-centers" element={<WorkCenterPage/>}>
                        <Route path=":workCenter" element={<WorkCenterForm/>}/>
                    </Route>
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default App;
