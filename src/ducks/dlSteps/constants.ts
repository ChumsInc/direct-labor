import {Tab} from "chums-components";
import {dlCodeIcon, dlTextIcon, dlTimingIcon} from "../../icons";

export const tabID = {
    settings: 'settings',
    timings: 'timings',
    whereUsed: 'where-used',
}
export const tabs: Tab[] = [
    {id: tabID.settings, title: 'Settings', icon: dlTextIcon},
    {id: tabID.timings, title: 'Timings', icon: dlTimingIcon},
    {id: tabID.whereUsed, title: 'Where Used', icon: dlCodeIcon},
]
