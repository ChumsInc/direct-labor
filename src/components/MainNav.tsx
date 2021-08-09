import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {ErrorBoundary, PillRouterList, Tab, tabListCreatedAction} from "chums-ducks";
import {getPreference, setPreference} from "../utils/preferences";
import {currentTabStorageKey} from "../utils/localStorageKeys";
import {
    operationCodesPath,
    operationCodesNavId,
    routingPath,
    routingNavId,
    workCentersPath,
    workCentersNavId, dlCodesNavId, dlCodesPath
} from "../routerPaths";

export interface MainNavProps {
    tabKey: string,
}

export const mainTabs: Tab[] = [
    {id: routingNavId, title: 'Routing', to: routingPath},
    {id: workCentersNavId, title: 'Work Centers', to: workCentersPath},
    {id: operationCodesNavId, title: 'Sage Ops', to: operationCodesPath},
    {id: dlCodesNavId, title: 'D/L Codes', to: dlCodesPath},
    {id: 'dlSteps', title: 'D/L Steps', to: '/dlSteps'},
]

export const getPreferredTab = (defaultValue: string) => {
    const tab: string = getPreference(currentTabStorageKey, defaultValue);
    if (!mainTabs.filter(t => t.id === tab).length) {
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
            <PillRouterList tabKey={tabKey} className="flex-column" onSelectTab={onSelectTab}/>
        </ErrorBoundary>
    )
}

export default MainNav;
