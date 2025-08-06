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
import type {MainNavLinkProps} from "@/components/MainNav.tsx";

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
