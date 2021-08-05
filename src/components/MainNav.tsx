import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {PillList, tabListCreatedAction, ErrorBoundary} from "chums-ducks";
import {MainNavProps, MainTab, MainTabMap, MainTabType} from "../types/MainNav";
import {getPreference, setPreference} from "../utils/preferences";
import {currentTabStorageKey} from "../utils/localStorageKeys";



export const mainTabMap: MainTabMap = {
    routing: 'Routing',
    workCenters: 'Work Centers',
    sageOperation: 'Sage Ops',
    dlCodes: 'D/L Codes',
    dlSteps: 'D/L Steps',
}
export const mainTabs: MainTab[] = Object.keys(mainTabMap)
    .map((key: string) => ({id: key, title: mainTabMap[key as MainTabType]} as MainTab));

export const getPreferredTab = (defaultValue: string) => {
    const tab: MainTabType = getPreference(currentTabStorageKey, defaultValue);
    if (mainTabMap[tab] === undefined) {
        return defaultValue;
    }
    return tab;
}

export const setPreferredTab = (tab: string) => setPreference(currentTabStorageKey, tab);

const defaultTab = getPreferredTab('');

const MainNav: React.FC<MainNavProps> = ({tabKey}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(tabListCreatedAction(mainTabs, tabKey, defaultTab));
    }, []);

    const onSelectTab = (id?: string) => setPreferredTab(id || '');

    return (
        <ErrorBoundary>
            <PillList tabKey={tabKey} className="flex-column" onSelectTab={onSelectTab}/>
        </ErrorBoundary>
    )
}

export default MainNav;
