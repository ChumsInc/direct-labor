import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadedSelector, loadingSelector, selectedStepSelector, selectStepSelector} from "./selectors";
import {loadDLStepAction} from "./actions";
import {Helmet} from "react-helmet";
import {selectedTabSelector, Tab, TabList, tabListCreatedAction} from "chums-ducks";
import SelectedStepsList from "../dlCodes/SelectedStepsList";
import SelectedStepTimings from "../timings/SelectedStepTimings";
import {dlCodeIcon, dlTextIcon, dlTimingIcon} from "../../icons";
import DLStepForm from "./DLStepForm";
import SelectedWhereUsedList from "./SelectedWhereUsedList";

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
    const dispatch = useDispatch();
    const step = useSelector(selectedStepSelector);
    const loaded = useSelector(loadedSelector);
    const loading = useSelector(loadingSelector);
    const navStep = useSelector(selectStepSelector(id || 0));
    const tab = useSelector(selectedTabSelector(tabsKey));

    useEffect(() => {
        dispatch(tabListCreatedAction(tabs, tabsKey, tabID.settings));
        // if (!loaded && !loading) {
        //     dispatch()
        // }
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
            <h2>Step Editor: {stepCode}</h2>
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
            <hr/>
            <code>
                <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(step, undefined, 2)}</pre>
            </code>
            <pre style={{whiteSpace: 'pre-wrap'}}>
                <code className="code"></code>
            </pre>
        </div>
    )
}
export default SelectedDLStep;
