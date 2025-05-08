import React from 'react';
import Nav, {NavProps} from "react-bootstrap/Nav";
import classNames from "classnames";
import {dlCodeIcon, dlTextIcon, dlTimingIcon} from "@/utils/icons";


export const tabID = {
    settings: 'settings',
    timings: 'timings',
    whereUsed: 'where-used',
}

export interface StepTabsProps extends Omit<NavProps, 'onSelect'> {
    onChangeTab: (tab: string) => void;
}

export default function StepTabs({activeKey, onChangeTab, ...rest}: StepTabsProps) {
    const selectHandler = (tab: string | null) => {
        onChangeTab(tab ?? tabID.settings);
    }
    return (
        <Nav variant="tabs" className="mb-1" defaultActiveKey={tabID.settings}
             activeKey={activeKey} onSelect={selectHandler} {...rest}>
            <Nav.Item>
                <Nav.Link eventKey={tabID.settings}>
                    <span className={classNames(dlTextIcon, "me-2")} aria-hidden/>
                    Settings
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey={tabID.timings}>
                    <span className={classNames(dlTimingIcon, "me-2")} aria-hidden/>
                    Timings
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey={tabID.whereUsed}>
                    <span className={classNames(dlCodeIcon, "me-2")} aria-hidden/>
                    Where Used
                </Nav.Link>
            </Nav.Item>
        </Nav>

    )
}
