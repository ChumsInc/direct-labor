import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentStep, selectCurrentStepStatus} from "./index";
import {loadDLStep, loadDLStepWhereUsed, setCurrentStep} from "./actions";
import {Helmet} from "react-helmet";
import {LoadingProgressBar, Tab, TabList} from "chums-components";
import SelectedStepTimings from "../timings/SelectedStepTimings";
import {dlCodeIcon, dlTextIcon, dlTimingIcon} from "../../icons";
import DLStepForm from "./DLStepForm";
import SelectedWhereUsedList from "./SelectedWhereUsedList";
import {useAppDispatch} from "../../app/configureStore";
import {useParams} from "react-router-dom";
import {newDLStep} from "./utils";

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

const SelectedDLStep = () => {
    const dispatch = useAppDispatch();
    const params = useParams<{ id: string }>()
    const step = useSelector(selectCurrentStep);
    const status = useSelector(selectCurrentStepStatus);
    const [tab, setTab] = useState<string>(tabID.settings);

    useEffect(() => {
        if (!params.id) {
            return;
        }
        if (params.id === '0') {
            dispatch(setCurrentStep(newDLStep));
            return;
        }
        dispatch(loadDLStep(params.id))
        dispatch(loadDLStepWhereUsed(params.id));
    }, [params]);

    return (
        <div>
            <Helmet>
                <title>D/L Step: {step?.stepCode ?? '-'}</title>
            </Helmet>
            <h2>Step Editor: <strong>{step?.stepCode}</strong></h2>
            <h3>{step?.description}</h3>

            <TabList tabs={tabs} className="mt-1 mb-1" currentTabId={tab} onSelectTab={(tab) => setTab(tab.id)}/>
            <div style={{height: '5px'}}>
                {status !== 'idle' && <LoadingProgressBar striped style={{height: '100%'}}/>}
            </div>
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
