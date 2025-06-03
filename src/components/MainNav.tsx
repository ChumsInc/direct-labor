import React, {useState} from "react";
import {currentMenuCollapseKey, getPreference, setPreference} from "@/utils/preferences";
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
} from "@/utils/icons";
import classNames from "classnames";
import AppErrorBoundary from "./AppErrorBoundary";
import {NavLink} from 'react-router';
import Nav from "react-bootstrap/Nav";
import {NavLinkProps} from 'react-bootstrap/NavLink'
import styled from "@emotion/styled";

export interface MainNavLinkProps extends NavLinkProps {
    id: string;
    title: string;
    to: string;
    icon?: string;
}

export const mainTabs: MainNavLinkProps[] = [
    {
        id: dlStepsNavId,
        title: 'D/L Steps',
        icon: dlStepIcon,
        to: dlStepsPath,
    },
    {
        id: dlCodesNavId,
        title: 'D/L Codes',
        icon: dlCodeIcon,
        to: dlCodesPath,
    },
    {
        id: workCentersNavId,
        title: 'Work Centers',
        icon: workCenterIcon,
        to: workCentersPath
    },
    {
        id: 'activity-codes',
        title: 'Activity Codes',
        icon: activityCodeIcon,
        to: "/activity-codes",
    },
    {
        id: 'templates',
        title: 'W/T Templates',
        icon: templatesIcon,
        to: "/templates",
    },
    {
        id: routingNavId,
        title: 'Routing',
        to: routingPath,
        icon: routingIcon
    },
    {
        id: operationCodesNavId,
        title: 'W/O Ops',
        icon: sageOperationCodeIcon,
        to: operationCodesPath
    },
]

const CollapsingNav = styled.div`
    .nav-link.active {
        .nav-item-icon {
            color: var(--bs-body-color);
        }
    }

    .nav-link {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    .nav-item-icon {
        flex: 0 0 auto;
        display: block;
    }

    .nav-item-text {
        width: auto;
        display: block;
    }

    &.collapsed {
        .nav-item-text {
            display: none;
        }

        .nav-link {
            gap: 0;
        }
    }
`
const MainNav = () => {
    const [collapsed, setCollapsed] = useState(getPreference(currentMenuCollapseKey, false));

    const onCollapse = () => {
        setPreference(currentMenuCollapseKey, !collapsed);
        setCollapsed(!collapsed);
    }


    const collapseIcon = collapsed ? 'bi-arrow-bar-right' : 'bi-arrow-bar-left';

    return (
        <AppErrorBoundary>
            <CollapsingNav className={classNames("main-nav", {collapsed})}>
                <Nav defaultActiveKey={mainTabs[0].id} className="flex-column" variant="pills">
                    <Nav.Item>
                        <Nav.Link onClick={onCollapse} aria-label="Collapse">
                            <span className={classNames("nav-item-icon", collapseIcon)} aria-hidden="true"/>
                            <span className="nav-item-text" aria-hidden>Collapse</span>
                        </Nav.Link>
                    </Nav.Item>
                    {mainTabs.map(tab => (
                        <Nav.Item key={tab.id}>
                            <Nav.Link as={NavLink} to={tab.to} aria-label={tab.title}>
                                {tab.icon &&
                                    <span className={classNames('nav-item-icon', tab.icon)} aria-hidden="true"/>}
                                <span className="nav-item-text" aria-hidden="true">{tab.title}</span>
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </CollapsingNav>
        </AppErrorBoundary>
    )
}

export default MainNav;
