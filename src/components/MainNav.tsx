import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    PillList,
    tabListCreatedAction,
    Tab
} from 'chums-ducks/dist/ducks'
import {MainTabType} from "../ducks/types";
import {ErrorBoundary} from "chums-ducks";

const tabSetID = 'dl-main';
interface MainTab extends Tab {
    id:MainTabType
}

const mainTabs:MainTab[] = [
    {id: 'routing', title: 'Routing'},
    {id: 'sage-operations', title: 'Sage Ops'},
    {id: 'dl-codes', title: 'DL Code'},
    {id: 'dl-steps', title: 'DL Steps'},
]

const MainNav:React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(tabListCreatedAction(mainTabs, tabSetID));
    }, []);
    // const tabs = useSelector(tabListSelector(tabSetID));
    // const onSelect = (id:MainTabType) => dispatch(tabSelectedAction(id));

    return (
        <ErrorBoundary>
            <PillList tabKey={tabSetID} className="flex-column" />
        </ErrorBoundary>
    )
}

export default MainNav;
