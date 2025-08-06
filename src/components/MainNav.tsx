import {useState} from "react";
import {currentMenuCollapseKey, getPreference, setPreference} from "@/utils/preferences";
import classNames from "classnames";
import AppErrorBoundary from "./AppErrorBoundary";
import {NavLink} from 'react-router';
import Nav from "react-bootstrap/Nav";
import {type NavLinkProps} from 'react-bootstrap/NavLink'
import styled from "@emotion/styled";
import {mainTabs} from "@/components/main-tabs.ts";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

export interface MainNavLinkProps extends NavLinkProps {
    id: string;
    title: string;
    to: string;
    icon: string;
}


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
                                {collapsed && (
                                    <OverlayTrigger overlay={<Tooltip>{tab.title}</Tooltip>} trigger={["hover", "focus"]}
                                                    delay={500}>
                                        <span className={classNames('nav-item-icon', tab.icon)} aria-hidden="true"/>
                                    </OverlayTrigger>
                                )}
                                {!collapsed && (
                                    <>
                                        <span className={classNames('nav-item-icon', tab.icon)} aria-hidden="true"/>
                                        <span className="nav-item-text" aria-hidden="true">{tab.title}</span>
                                    </>
                                )}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </CollapsingNav>
        </AppErrorBoundary>
    )
}

export default MainNav;
