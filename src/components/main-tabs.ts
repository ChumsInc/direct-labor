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
} from "@/app/routerPaths.ts";

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
        title: 'Timed Steps',
        icon: dlStepIcon,
        to: dlStepsPath,
    },
    {
        id: dlCodesNavId,
        title: 'D/L Activity Codes',
        icon: dlCodeIcon,
        to: dlCodesPath,
    },
    {
        id: 'templates',
        title: 'W/T Templates',
        icon: templatesIcon,
        to: "/templates",
    },
    {
        id: workCentersNavId,
        title: 'Work Centers',
        icon: workCenterIcon,
        to: workCentersPath
    },
    {
        id: 'activity-codes',
        title: 'W/T Activity Codes',
        icon: activityCodeIcon,
        to: "/activity-codes",
    },
    {
        id: routingNavId,
        title: 'W/O Routing',
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
