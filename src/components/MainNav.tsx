import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {ErrorBoundary, NavItem, PillRouterList, Tab, tabListCreatedAction} from "chums-ducks";
import {currentMenuCollapseKey, currentTabStorageKey, getPreference, setPreference} from "../utils/preferences";
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
import classNames from "classnames";
import "./mainNav.scss";

export interface MainNavProps {
    tabKey: string,
}

export const mainTabs: Tab[] = [
    {id: routingNavId, title: 'Routing', to: routingPath, icon: routingIcon},
    {id: workCentersNavId, title: 'Work Centers', to: workCentersPath, icon: workCenterIcon},
    {id: operationCodesNavId, title: 'Sage Ops', to: operationCodesPath, icon: sageOperationCodeIcon},
    {id: dlCodesNavId, title: 'D/L Codes', to: dlCodesPath, icon: dlCodeIcon},
    {id: dlStepsNavId, title: 'D/L Steps', to: dlStepsPath, icon: dlStepIcon},
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

const MainNav: React.FC<MainNavProps> = ({tabKey}) => {
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(getPreference(currentMenuCollapseKey, false));
    useEffect(() => {
        dispatch(tabListCreatedAction(mainTabs, tabKey, defaultTab));
    }, []);

    const onCollapse = () => {
        setPreference(currentMenuCollapseKey, !collapsed);
        setCollapsed(!collapsed);
    }
    const collapseIcon = collapsed ? 'bi-arrow-bar-right' : 'bi-arrow-bar-left'

    return (
        <ErrorBoundary>
            <div className={classNames('dl-nav', {collapsed: collapsed})}>
                <ul className="nav">
                    <NavItem onSelect={onCollapse} id="toggle-nav" title="Collapse" icon={collapseIcon}/>
                </ul>
                <PillRouterList tabKey={tabKey} className="flex-column" />
            </div>
        </ErrorBoundary>
    )
}

export default MainNav;
