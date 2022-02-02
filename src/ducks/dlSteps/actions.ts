import {DLStepsAction, DLStepsThunkAction, newDLStep} from "./types";
import {fetchJSON, fetchPOST} from "chums-ducks";
import {DLBasicStep, DLStep, DLSteps, DLTiming} from "../types";
import {
    filterChanged,
    filterInactiveChanged,
    stepChanged,
    stepSelected,
    stepsLoadListFailed,
    stepsLoadListRequested,
    stepsLoadListSucceeded,
    stepsLoadStepFailed,
    stepsLoadStepRequested,
    stepsLoadStepSucceeded,
    stepsSaveFailed,
    stepsSaveRequested,
    stepsSaveSucceeded,
    stepTimingChanged,
    wcFilterChanged
} from "./actionTypes";
import {loadingSelector, selectedLoadingSelector, selectedSavingSelector} from "./selectors";
import {filterInactiveStepsKey, setPreference} from "../../utils/preferences";

const listURL = `/api/operations/production/dl/steps`;
const stepURL = (step: DLBasicStep) => `/api/operations/production/dl/steps/${encodeURIComponent(step.id)}`;

export const dlStepChangedAction = (change: Object) => ({type: stepChanged, payload: {change}});
export const dlStepChangeTimingAction = (timing: DLTiming) => ({type: stepTimingChanged, payload: {timing}});

export const filterInactiveAction = (filterInactive: boolean): DLStepsAction => {
    setPreference(filterInactiveStepsKey, filterInactive);
    return {type: filterInactiveChanged}
}

export const setWCFilterAction = (workCenter: string): DLStepsAction => ({
    type: wcFilterChanged,
    payload: {filter: workCenter}
});

export const setDLStepFilterAction = (filter: string): DLStepsAction => ({
    type: filterChanged,
    payload: {filter: filter}
})

export const loadDLStepsAction = (): DLStepsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (loadingSelector(state)) {
                return;
            }
            dispatch({type: stepsLoadListRequested});
            const {steps, machines} = await fetchJSON(listURL, {cache: 'no-cache'});
            const list: DLSteps = {};
            steps.forEach((step: DLStep) => {
                list[step.id] = step;
            })
            dispatch({type: stepsLoadListSucceeded, payload: {list, machines}});
        } catch (err) {
            if (err instanceof Error) {
                console.warn("loadDLStepsAction()", err.message);
                return dispatch({type: stepsLoadListFailed, payload: {error: err, context: stepsLoadListRequested}});
            }
            console.error(err);
        }
    }

export const loadDLStepAction = (step: DLBasicStep = newDLStep): DLStepsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectedLoadingSelector(state)) {
                return;
            }
            dispatch({type: stepSelected, payload: {basicStep: step}});
            if (!step.id) {
                // selected a new step, so no need to load it
                return;
            }
            dispatch({type: stepsLoadStepRequested});
            const url = stepURL(step)
            const {step: _step, whereUsed} = await fetchJSON(url, {cache: 'no-cache'});
            dispatch({type: stepsLoadStepSucceeded, payload: {step: _step || newDLStep, codes: whereUsed}});
        } catch (err) {
            if (err instanceof Error) {
                console.warn("loadDLStepAction()", err.message);
                return dispatch({type: stepsLoadStepFailed, payload: {error: err, context: stepsLoadStepRequested}});
            }
            console.error(err);
        }
    }

export const saveDLStepAction = (step: DLStep): DLStepsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectedLoadingSelector(state) || selectedSavingSelector(state)) {
                return;
            }
            const replaceStep = step.id === 0;
            dispatch({type: stepsSaveRequested});
            const url = stepURL(step);
            const {step: _step, whereUsed} = await fetchPOST(url, step);
            dispatch({type: stepsSaveSucceeded, payload: {step: _step, codes: whereUsed}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveDLStepAction()", error.message);
                return dispatch({type: stepsSaveFailed, payload: {error, context: stepsSaveRequested}})
            }
            console.error("saveDLStepAction()", error);
        }
    }
