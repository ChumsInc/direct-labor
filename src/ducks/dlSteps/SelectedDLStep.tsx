import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentStep, selectStepSelector, selectStepsLoaded} from "./selectors";
import {loadDLStepAction} from "./actions";
import {Helmet} from "react-helmet";
import {Tab, TabList} from "chums-components";
import SelectedStepTimings from "../timings/SelectedStepTimings";
import {dlCodeIcon, dlTextIcon, dlTimingIcon} from "../../icons";
import DLStepForm from "./DLStepForm";
import SelectedWhereUsedList from "./SelectedWhereUsedList";
import {useAppDispatch} from "../../app/configureStore";

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

const SelectedDLStep = ({id}:{
    id?: number
}) => {
    const dispatch = useAppDispatch();
    const step = useSelector(selectCurrentStep);
    const loaded = useSelector(selectStepsLoaded);
    const navStep = useSelector(selectStepSelector(id || 0));
    const [tab, setTab] = useState<string>(tabID.settings);

    useEffect(() => {
        if (id !== step?.id) {
            dispatch(loadDLStepAction(navStep))
        }
    }, [id, loaded]);


    return (
        <div>
            <Helmet>
                <title>D/L Step: {step?.stepCode}</title>
            </Helmet>
            <h2>Step Editor: <strong>{step?.stepCode}</strong></h2>
            <h3>{step?.description}</h3>

            <TabList tabs={tabs} currentTabId={tab} onSelectTab={(tab) => setTab(tab.id)} className="mt-3 mb-1"/>
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
