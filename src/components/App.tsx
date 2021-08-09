import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MainNav from "./MainNav";
import RoutingContent from "./RoutingContent";
import {AlertList, selectedTabSelector} from "chums-ducks";
import WorkCenterContent from "./WorkCenterContent";
import OperationCodesContent from "./OperationCodesContent";
import {Route} from 'react-router-dom';
import {dlCodesRouterPath, operationCodesRouterPath, routingRouterPath, workCenterRouterPath} from "../routerPaths";
import DirectLaborCodesContent from "./DirectLaborCodesContent";

const mainTabKey = 'dl-main';

const App: React.FC = () => {
    const currentTab = useSelector(selectedTabSelector(mainTabKey))
    return (
        <>
            <h2>App Goes Here</h2>
            <AlertList/>
            <div className="row g-3">
                <div className="col-auto">
                    <MainNav tabKey={mainTabKey}/>
                </div>
                <div className="col">
                    <Route path={routingRouterPath}  component={RoutingContent} />
                    <Route path={workCenterRouterPath}  component={WorkCenterContent} />
                    <Route path={operationCodesRouterPath}  component={OperationCodesContent} />
                    <Route path={dlCodesRouterPath} component={DirectLaborCodesContent} />
                </div>
            </div>
        </>
    )
}

export default App;
