import {DLCode, DLCodeList, DLCodeStep, DLCodeSteps} from "../types";
import {fetchDELETE, fetchJSON, fetchPOST} from "chums-ducks";
import {
    dlCodeChanged,
    deleteStepFailed,
    deleteStepRequested, deleteStepSucceeded,
    dlCodeSelected,
    dlCodeStepOrderChanged,
    filterChanged,
    filterInactiveChanged,
    loadDLCodeFailed,
    loadDLCodeRequested,
    loadDLCodesFailed,
    loadDLCodesRequested,
    loadDLCodesSucceeded,
    loadDLCodeSucceeded,
    saveDLCodeFailed,
    saveDLCodeRequested,
    saveDLCodeSucceeded,
    sortDLStepFailed,
    sortDLStepRequested,
    sortDLStepSucceeded,
    stepAddFailed,
    stepAddRequested,
    stepAddSucceeded,
    wcFilterChanged
} from "./actionTypes";
import {loadingSelector, selectedHeaderSelector, selectedLoadingSelector, selectedSavingSelector,} from "./selectors";
import {dlCodeKey, DLCodesAction, DLCodesThunkAction} from "./types";
import {dlCodeStepSorter, dlStepList} from "./utils";
import {dlStepKey} from "../dlSteps/types";
import {filterInactiveCodesKey, setPreference} from "../../utils/preferences";

const dlCodesListURL = (dlCode?: string) => `/api/operations/production/dl/codes/list/${encodeURIComponent(dlCode || '')}`;
const dlCodeURL = (id: string | number) => `/api/operations/production/dl/codes/${encodeURIComponent(id)}`;
const dlCodeStepURL = (id: number | string, stepId: string | number) => `/api/operations/production/dl/codes/${encodeURIComponent(id)}/step/${encodeURIComponent(stepId)}`;
const dlCodeStepsOrderURL = (id: number) => `/api/operations/production/dl/codes/${encodeURIComponent(id)}/steps`;


export const setWCFilterAction = (workCenter: string): DLCodesAction => ({
    type: wcFilterChanged,
    payload: {filter: workCenter}
});

export const filterInactiveAction = (filterInactive: boolean): DLCodesAction => {
    setPreference(filterInactiveCodesKey, filterInactive);
    return {type: filterInactiveChanged};
}

export const dlStepOrderChangedAction = (list: DLCodeStep[]): DLCodesAction => {
    const steps: DLCodeSteps = {};
    list.forEach(step => {
        steps[dlStepKey(step)] = step;
    })
    return {type: dlCodeStepOrderChanged, payload: {steps}};
}
export const setDLCodeFilterAction = (filter: string): DLCodesAction => ({
    type: filterChanged,
    payload: {filter: filter}
})

export const dlCodeChangedAction = (change: object): DLCodesAction => ({type: dlCodeChanged, payload: {change}});

export const loadDLCodesAction = (): DLCodesThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = loadingSelector(state);
            if (loading) {
                return;
            }
            dispatch({type: loadDLCodesRequested});
            const url = dlCodesListURL();
            const {dlCodes} = await fetchJSON(url, {cache: 'no-cache'});
            const list: DLCodeList = {};
            dlCodes.forEach((row: DLCode) => list[dlCodeKey(row)] = row);
            dispatch({type: loadDLCodesSucceeded, payload: {list}})
        } catch (err) {
            if (err instanceof Error) {
                console.log("()", err.message);
                return dispatch({type: loadDLCodesFailed, payload: {error: err, context: loadDLCodesRequested}});
            }
            console.error(err);
        }
    }

export const loadDLCodeAction = (dlCode: DLCode): DLCodesThunkAction =>
    async (dispatch, getState) => {
        try {
            dispatch({type: dlCodeSelected, payload: {header: dlCode}});
            if (!dlCode.id) {
                return;
            }
            const state = getState();
            const loading = selectedLoadingSelector(state);
            const saving = selectedSavingSelector(state);
            if (loading || saving) {
                return;
            }
            dispatch({type: loadDLCodeRequested});
            const url = dlCodeURL(dlCode.id);
            const {dlCode: header, steps} = await fetchJSON(url, {cache: 'no-cache'});
            dispatch({type: loadDLCodeSucceeded, payload: {header, steps: dlStepList(steps)}});
        } catch (err) {
            if (err instanceof Error) {
                console.log("loadDLCodeAction()", err.message);
                return dispatch({type: loadDLCodeFailed, payload: {error: err, context: loadDLCodeRequested}});
            }
            console.error(err);
        }
    }

export const saveDLCodeAction = (dlCode: DLCode): DLCodesThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectedLoadingSelector(state);
            const saving = selectedSavingSelector(state);
            if (loading || saving) {
                return;
            }
            dispatch({type: saveDLCodeRequested});
            const url = dlCodeURL(dlCode.id);
            const {dlCode: header, steps} = await fetchPOST(url, dlCode);
            dispatch({type: saveDLCodeSucceeded, payload: {header, steps: dlStepList(steps)}});
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.warn("saveDLCodeAction()", err.message);
                return dispatch({type: saveDLCodeFailed, payload: {error: err, context: saveDLCodeRequested}});
            }
            console.error(err);
        }
    }

export const addDLCodeStepAction = (id: number, stepId: number): DLCodesThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectedLoadingSelector(state) || selectedSavingSelector(state)) {
                return;
            }
            dispatch({type: stepAddRequested});
            const url = dlCodeStepURL(id, stepId);
            const {dlCode: header, steps} = await fetchPOST(url, {});
            dispatch({type: stepAddSucceeded, payload: {header, steps: dlStepList(steps)}});
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.warn("()", err.message);
                dispatch({type: stepAddFailed, payload: {error: err, context: stepAddRequested}});
            }
        }
    }

export const saveDLCodeStepOrder = (list: DLCodeStep[]): DLCodesThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const selected = selectedHeaderSelector(state);
            const loading = selectedLoadingSelector(state);
            const saving = selectedSavingSelector(state);
            if (!selected.id || loading || saving || list.length === 0) {
                return;
            }
            dispatch({type: sortDLStepRequested});
            const url = dlCodeStepsOrderURL(selected.id);
            const body = {
                steps: list.sort(dlCodeStepSorter).map(step => step.id)
            }
            const {dlCode, steps} = await fetchPOST(url, body);
            dispatch({type: sortDLStepSucceeded, payload: {header: dlCode, steps: dlStepList(steps)}});
        } catch (err: any) {
            console.warn("()", err.message);
            dispatch({type: sortDLStepFailed, payload: {error: err, context: sortDLStepRequested}});
        }
    }


export const deleteStepAction = (step:DLCodeStep): DLCodesThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectedLoadingSelector(state) || selectedSavingSelector(state)) {
                return;
            }
            dispatch({type: deleteStepRequested});
            const url = dlCodeStepURL(step.dlCodeId, step.stepId);
            const {dlCode, steps} = await fetchDELETE(url);
            dispatch({type: deleteStepSucceeded, payload: {header: dlCode, steps: dlStepList(steps)}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("deleteStepAction()", error.message);
                return dispatch({type: deleteStepFailed, payload: {error, context: deleteStepRequested}})
            }
            console.error("deleteStepAction()", error);
        }
    }
