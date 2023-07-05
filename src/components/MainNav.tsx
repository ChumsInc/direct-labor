import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Alert, NavItemProps, NavList} from "chums-components";
import {currentMenuCollapseKey, currentTabStorageKey, getPreference, setPreference} from "../utils/preferences";
import {ErrorBoundary} from "react-error-boundary";

import {
    dlCodesNavId,
    dlCodesPath,
    dlStepsNavId,
    dlStepsPath,
    operationCodesNavId,
    operationCodesPath,
    routingNavId,
    routingPath,
    workCentersNavId,
    workCentersPath
} from "../routerPaths";
import {dlCodeIcon, dlStepIcon, routingIcon, sageOperationCodeIcon, workCenterIcon} from "../icons";
import "./mainNav.scss";
import {Link} from "react-router-dom";

export interface MainNavProps {
    tabKey: string,
}

export const mainTabs: NavItemProps[] = [
    {id: routingNavId, title: 'Routing', element: <Link to={routingPath}/>, icon: routingIcon},
    {id: workCentersNavId, title: 'Work Centers', element: <Link to={workCentersPath}/>, icon: workCenterIcon},
    {id: operationCodesNavId, title: 'Sage Ops', element: <Link to={operationCodesPath}/>, icon: sageOperationCodeIcon},
    {id: dlCodesNavId, title: 'D/L Codes', element: <Link to={dlCodesPath}/>, icon: dlCodeIcon},
    {id: dlStepsNavId, title: 'D/L Steps', element: <Link to={dlStepsPath}/>, icon: dlStepIcon},
]

export const getPreferredTab = (defaultValue: string) => {
    const tab: string = getPreference(currentTabStorageKey, defaultValue);
    if (!mainTabs.filter(t => t.id === tab).length) {
        return defaultValue;
    }
    return tab;
}

export const setPreferredTab = (tab: string) => setPreference(currentTabStorageKey, tab);

const defaultTab = getPreferredTab('');

const MainNav = () => {
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(getPreference(currentMenuCollapseKey, false));
    const [tab, setTab] = useState<string>(defaultTab);

    const onCollapse = () => {
        setPreference(currentMenuCollapseKey, !collapsed);
        setCollapsed(!collapsed);
    }
    const collapseIcon = collapsed ? 'bi-arrow-bar-right' : 'bi-arrow-bar-left'

    return (
        <ErrorBoundary fallback={<Alert color="danger">Error in Main Nav</Alert>}>
            <NavList items={mainTabs} currentTab={tab} onChange={(tab) => setTab(tab)}/>
        </ErrorBoundary>
    )
}

export default MainNav;
