import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {loadedSelector, selectedStepSelector, selectStepSelector} from "./selectors";
import {loadDLStepAction} from "./actions";
import {Helmet} from "react-helmet";
import {selectedTabSelector, Tab, TabList, tabListCreatedAction} from "chums-ducks";
import SelectedStepTimings from "../timings/SelectedStepTimings";
import {dlCodeIcon, dlTextIcon, dlTimingIcon} from "../../icons";
import DLStepForm from "./DLStepForm";
import SelectedWhereUsedList from "./SelectedWhereUsedList";
import {useAppDispatch} from "../../app/configureStore";

export interface SelectedDLStepProps {
    id?: number,
}


const tabsKey = 'dl-steps-tabs';

const tabID = {
    settings: 'settings',
    timings: 'timings',
    whereUsed: 'where-used',
}
const tabs: Tab[] = [
    {id: tabID.settings, title: 'Settings', icon: dlTextIcon},
    {id: tabID.timings, title: 'Timings', icon: dlTimingIcon},
    {id: tabID.whereUsed, title: 'Where Used', icon: dlCodeIcon},
]

const SelectedDLStep: React.FC<SelectedDLStepProps> = ({id}) => {
    const dispatch = useAppDispatch();
    const step = useSelector(selectedStepSelector);
    const loaded = useSelector(loadedSelector);
    const navStep = useSelector(selectStepSelector(id || 0));
    const tab = useSelector(selectedTabSelector(tabsKey));

    useEffect(() => {
        dispatch(tabListCreatedAction(tabs, tabsKey, tabID.settings));
    }, []);
    useEffect(() => {
        if (id !== step.id) {
            dispatch(loadDLStepAction(navStep))
        }
    }, [id, loaded]);

    const {
        stepCode,
        description,
    } = step;
    return (
        <div>
            <Helmet>
                <title>D/L Step: {stepCode}</title>
            </Helmet>
            <h2>Step Editor: <strong>{stepCode}</strong></h2>
            <h3>{description}</h3>

            <TabList tabKey={tabsKey} className="mt-3 mb-1"/>
            {tab === tabID.settings && (
                <DLStepForm/>
            )}
            {tab === tabID.timings && (
                <SelectedStepTimings/>
            )}
            {tab === tabID.whereUsed && (
                <SelectedWhereUsedList/>
            )}
        </div>
    )
}
export default SelectedDLStep;
