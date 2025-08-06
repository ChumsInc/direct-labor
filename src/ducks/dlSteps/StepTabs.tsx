import Nav, {type NavProps} from "react-bootstrap/Nav";
import classNames from "classnames";
import {dlCodeIcon, dlTextIcon, dlTimingIcon} from "@/utils/icons";
import {tabIDMap} from "@/ducks/dlSteps/utils.ts";



export interface StepTabsProps extends Omit<NavProps, 'onSelect'> {
    onChangeTab: (tab: string) => void;
}

export default function StepTabs({activeKey, onChangeTab, ...rest}: StepTabsProps) {
    const selectHandler = (tab: string | null) => {
        onChangeTab(tab ?? tabIDMap.settings);
    }
    return (
        <Nav variant="tabs" className="mb-1" defaultActiveKey={tabIDMap.settings}
             activeKey={activeKey} onSelect={selectHandler} {...rest}>
            <Nav.Item>
                <Nav.Link eventKey={tabIDMap.settings}>
                    <span className={classNames(dlTextIcon, "me-2")} aria-hidden/>
                    Settings
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey={tabIDMap.timings}>
                    <span className={classNames(dlTimingIcon, "me-2")} aria-hidden/>
                    Timings
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey={tabIDMap.whereUsed}>
                    <span className={classNames(dlCodeIcon, "me-2")} aria-hidden/>
                    Where Used
                </Nav.Link>
            </Nav.Item>
        </Nav>

    )
}
