import {Link, useLocation} from "react-router";
import {Breadcrumb} from "react-bootstrap";
import DLStepIcon from "@/components/icons/DLStepIcon.tsx";
import EditIcon from "@/components/icons/EditIcon.tsx";
import DLCodeIcon from "@/components/icons/DLCodeIcon.tsx";
import TemplatesIcon from "@/components/icons/TemplatesIcon.tsx";
import InfoIcon from "@/components/icons/InfoIcon.tsx";
import WorkCenterIcon from "@/components/icons/WorkCenterIcon.tsx";
import ActivityCodeIcon from "@/components/icons/ActivityCodeIcon.tsx";
import RoutingIcon from "@/components/icons/RoutingIcon.tsx";

export default function Breadcrumbs() {
    const path = useLocation();
    const paths = path.pathname.split('/').filter(Boolean);
    return (
        <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{to: '/'}}>Top</Breadcrumb.Item>
            {paths[0] === 'dl-steps' && (
                <Breadcrumb.Item active={paths.length === 1} linkAs={Link} linkProps={{to: "/dl-steps"}}>
                    Labor Steps <DLStepIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}
            {paths[0] === 'dl-steps' && paths.length === 2 && (
                <Breadcrumb.Item active>
                    Labor Step Editor
                    <EditIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}

            {paths[0] === 'dl-codes' && (
                <Breadcrumb.Item active={paths.length === 1} linkAs={Link} linkProps={{to: '/dl-codes'}}>
                    Labor Codes
                    <DLCodeIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}
            {paths[0] === 'dl-codes' && paths.length === 2 &&
                <Breadcrumb.Item active>
                    Labor Code Editor
                    <EditIcon className="ms-1"/>
                </Breadcrumb.Item>}

            {paths[0] === 'templates' && (
                <Breadcrumb.Item active={paths.length === 1} linkAs={Link} linkProps={{to: '/templates'}}>
                    Templates
                    <TemplatesIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}
            {paths[0] === 'templates' && paths.length > 1 && (
                <Breadcrumb.Item active>
                    Template Detail
                    <InfoIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}

            {paths[0] === 'work-centers' && (
                <Breadcrumb.Item active={paths.length === 1} linkAs={Link} linkProps={{to: '/work-centers'}}>
                    Work Centers
                    <WorkCenterIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}
            {paths[0] === 'work-centers' && paths.length > 1 && (
                <Breadcrumb.Item active linkAs={Link} linkProps={{to: '/work-centers'}}>
                    Work Center Actions
                    <EditIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}

            {paths[0] === 'activity-codes' && (
                <Breadcrumb.Item active={paths.length === 1} linkAs={Link} linkProps={{to: '/activity-codes'}}>
                    W/T Activity Code
                    <ActivityCodeIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}
            {paths[0] === 'activity-codes' && paths.length > 1 && (
                <Breadcrumb.Item active linkAs={Link} linkProps={{to: '/activity-codes'}}>
                    W/T Activity Code Detail
                    <InfoIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}

            {paths[0] === 'routing' && (
                <Breadcrumb.Item active={paths.length === 1} linkAs={Link} linkProps={{to: '/routing'}}>
                    W/O Routing
                    <RoutingIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}
            {paths[0] === 'routing' && paths.length > 1 && (
                <Breadcrumb.Item active linkAs={Link} linkProps={{to: '/routing'}}>
                    W/O Routing Detail
                    <InfoIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}

            {paths[0] === 'operation-codes' && (
                <Breadcrumb.Item active={paths.length === 1} linkAs={Link} linkProps={{to: '/operation-codes'}}>
                    W/O Operation Codes
                    <RoutingIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}
            {paths[0] === 'operation-codes' && paths.length > 1 && (
                <Breadcrumb.Item active linkAs={Link} linkProps={{to: '/operation-codes'}}>
                    W/O Operation Code Detail
                    <InfoIcon className="ms-1"/>
                </Breadcrumb.Item>
            )}

        </Breadcrumb>
    )
}
