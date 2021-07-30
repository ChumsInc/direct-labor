import React from 'react';
import {useDispatch} from "react-redux";
import MainNav from "./MainNav";
import RoutingContent from "./RoutingContent";

const App:React.FC = () => {
    useDispatch()
    return (
        <>
            <h2>App Goes Here</h2>
            <div className="row g-3">
                <div className="col-auto">
                    <MainNav />
                </div>
                <div className="col">
                    <RoutingContent />
                </div>
            </div>
        </>
    )
}

export default App;
