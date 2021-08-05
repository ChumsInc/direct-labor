import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MainNav from "./MainNav";
import RoutingContent from "./RoutingContent";
import {AlertList, selectedTabSelector} from "chums-ducks";
import WorkCenterContent from "./WorkCenterContent";
import OperationCodesContent from "./OperationCodesContent";

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
                    {currentTab === 'routing' && <RoutingContent/>}
                    {currentTab === 'workCenters' && <WorkCenterContent/>}
                    {currentTab === 'sageOperation' && <OperationCodesContent/>}
                </div>
            </div>
        </>
    )
}

export default App;
