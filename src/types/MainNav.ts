import {Tab} from "chums-ducks/dist/ducks";

export interface MainTabMap {
    routing: string,
    workCenters: string,
    sageOperation: string,
    dlCodes: string,
    dlSteps: string,
}

export type MainTabType = keyof MainTabMap;

export interface MainTab extends Tab {
    id: MainTabType
}

export interface MainNavProps {
    tabKey: string,
}
