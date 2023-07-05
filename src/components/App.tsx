import React from 'react';
import MainNav from "./MainNav";
import RoutingContent from "./RoutingContent";
import {AlertList} from "chums-ducks";
import TKAlertList from "../ducks/alerts/AlertList";
import WorkCenterContent from "./WorkCenterContent";
import OperationCodesContent from "./OperationCodesContent";
import {Route, Routes} from 'react-router-dom';
import {
    dlCodesRouterPath,
    dlStepsRouterPath,
    operationCodesRouterPath,
    routingRouterPath,
    workCenterRouterPath
} from "../routerPaths";
import DirectLaborCodesContent from "./DirectLaborCodesContent";
import DirectLaborStepsContent from "./DirectLaborStepsContent";
import VersionInfo from "../ducks/version/VersionInfo";
import AppContainer from "./AppContainer";

const App: React.FC = () => {
    return (
        <>
            <AlertList/>
            <TKAlertList />
            <div className="row g-3">
                <div className="col-auto">
                    <MainNav/>
                    <VersionInfo />
                </div>
                <div className="col">
                    <Routes>
                        <Route path="/" element={<AppContainer />} />
                        <Route path={routingRouterPath} element={<RoutingContent />}/>
                        <Route path={workCenterRouterPath} element={<WorkCenterContent />}/>
                        <Route path={operationCodesRouterPath} element={<OperationCodesContent />}/>
                        <Route path={dlCodesRouterPath} element={<DirectLaborCodesContent />}/>
                        <Route path={dlStepsRouterPath} element={<DirectLaborStepsContent />}/>
                    </Routes>
                </div>
            </div>
        </>
    )
}

export default App;
