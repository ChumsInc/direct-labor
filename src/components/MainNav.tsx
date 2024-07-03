import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {NavItem, NavItemProps, NavList} from "chums-components";
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
import {
    activityCodeIcon,
    dlCodeIcon,
    dlStepIcon,
    routingIcon,
    sageOperationCodeIcon,
    templatesIcon,
    workCenterIcon
} from "../icons";
import classNames from "classnames";
import "./mainNav.scss";
import ErrorBoundary from "./ErrorBoundary";
import {NavLink, useLocation} from 'react-router-dom';

export const RoutedLink = ({to, icon, title}: {
    to: string;
    icon?: string;
    title: string;
}) => {
    return (
        <NavLink to={to} className="nav-link">
            {!!icon && <span className={classNames('nav-item-icon me-1', icon)}/>}
            <span className="nav-item-text">{title}</span>
        </NavLink>
    )
}

export const mainTabs: NavItemProps[] = [
    {
        id: dlStepsNavId,
        title: 'D/L Steps',
        icon: dlStepIcon,
        element: <RoutedLink to={dlStepsPath} title="D/L Steps" icon={dlStepIcon}/>
    },
    {
        id: dlCodesNavId,
        title: 'D/L Codes',
        icon: dlCodeIcon,
        element: <RoutedLink to={dlCodesPath} title="D/L Codes" icon={dlCodeIcon}/>
    },
    {
        id: workCentersNavId,
        title: 'Work Centers',
        icon: workCenterIcon,
        element: <RoutedLink to={workCentersPath} title="Work Centers" icon={workCenterIcon}/>
    },
    {
        id: 'activity-codes',
        title: 'Activity Codes',
        icon: activityCodeIcon,
        element: <RoutedLink to="/activity-codes" title="Activity Codes" icon="bi-activity" />
    },
    {
        id: 'templates',
        title: 'W/T Templates',
        icon: templatesIcon,
        element: <RoutedLink to="/templates" title="W/T Templates" icon={templatesIcon}/>
    },
    {id: routingNavId, title: 'Routing', element: <RoutedLink to={routingPath} title="Routing" icon={routingIcon}/>},
    {
        id: operationCodesNavId,
        title: 'Sage Ops',
        icon: sageOperationCodeIcon,
        element: <RoutedLink to={operationCodesPath} title="W/O Ops" icon={sageOperationCodeIcon}/>
    },
]

export const getPreferredTab = (defaultValue: string) => {
    const tab: string = getPreference(currentTabStorageKey, defaultValue);
    if (!mainTabs.filter(t => t.id === tab).length) {
        return defaultValue;
    }
    return tab;
}

const MainNav = () => {
    const location = useLocation();
    const [currentTab, setCurrentTab] = useState<string>('');
    const [collapsed, setCollapsed] = useState(getPreference(currentMenuCollapseKey, false));

    const onCollapse = () => {
        setPreference(currentMenuCollapseKey, !collapsed);
        setCollapsed(!collapsed);
    }


    const collapseIcon = collapsed ? 'bi-arrow-bar-right' : 'bi-arrow-bar-left';

    return (
        <ErrorBoundary>
            <div className={classNames('dl-nav', {collapsed: collapsed})}>
                <ul className="nav">
                    <NavItem onSelect={onCollapse} id="toggle-nav" title="Collapse" icon={collapseIcon}/>
                </ul>
                <NavList items={mainTabs} onChange={setCurrentTab} currentTab={currentTab} variant="pills" vertical />
            </div>
        </ErrorBoundary>
    )
}

export default MainNav;
