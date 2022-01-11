import {DLTiming} from "../types";
import {TimingsAction, TimingsThunkAction} from "./types";
import {selectCurrentLoading, selectCurrentSaving, selectCurrentTiming} from "./selectors";
import {fetchJSON, fetchPOST} from "chums-ducks";
import {
    applyTimingFailed,
    applyTimingRequested, applyTimingSucceeded,
    changeTiming,
    editTiming,
    loadTimingEntriesFailed,
    loadTimingEntriesRequested,
    loadTimingEntriesSucceeded,
    saveTimingEntriesFailed,
    saveTimingEntriesRequested,
    saveTimingEntriesSucceeded
} from "./actionTypes";

const timingsURL = (id: number, idTimings?: number) => `/api/operations/production/dl/steps/${encodeURIComponent(id)}/timings/${encodeURIComponent(idTimings || '')}`;
const applyTimingsURL = (id: number, idTiming: number) => `/api/operations/production/dl/steps/${encodeURIComponent(id)}/timing/${encodeURIComponent(idTiming)}`;


export const editTimingAction = (timing?: DLTiming): TimingsAction => ({
    type: editTiming,
    payload: {timing, edit: !!timing}
});

export const changeTimingAction = (change: object): TimingsAction => ({type: changeTiming, payload: {change}});

export const loadTimingAction = (stepId: number, timingId: number): TimingsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectCurrentLoading(state);
            const saving = selectCurrentSaving(state);
            if (loading || saving) {
                return;
            }
            dispatch({type: loadTimingEntriesRequested});
            const url = timingsURL(stepId, timingId);
            const {timings} = await fetchJSON(url, {cache: "no-cache"});
            dispatch({type: loadTimingEntriesSucceeded, payload: {timings}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("loadTimingAction()", error.message);
                return dispatch({type: loadTimingEntriesFailed, payload: {error, context: loadTimingEntriesRequested}});
            }
            console.error("loadTimingAction()", error);
        }
    }

export const saveTimingAction = (timing: DLTiming): TimingsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectCurrentLoading(state);
            const saving = selectCurrentSaving(state);
            if (loading || saving) {
                return;
            }
            dispatch({type: applyTimingRequested})
            timing.entries = timing.entries.filter(val => !!val);
            const url = timingsURL(timing.idSteps, timing.id);
            console.log(url, timing);
            const {timings, step} = await fetchPOST(url, timing);
            dispatch({type: saveTimingEntriesSucceeded, payload: {timings, step}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveTimingAction()", error.message);
                return dispatch({type: saveTimingEntriesFailed, payload: {error, context: saveTimingEntriesRequested}})
            }
            console.error("saveTimingAction()", error);
        }
    }


export const applyTimingAction = (): TimingsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectCurrentLoading(state);
            const saving = selectCurrentSaving(state);
            const timing = selectCurrentTiming(state);
            if (loading || saving || !timing.id) {
                return;
            }
            dispatch({type: applyTimingRequested});
            const url = applyTimingsURL(timing.idSteps, timing.id);
            const {step} = await fetchJSON(url, {method: 'PUT'});
            dispatch({type: applyTimingSucceeded, payload: {step}});
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("applyTimingAction()", error.message);
                return dispatch({type:applyTimingFailed, payload: {error, context: applyTimingRequested}})
            }
            console.error("applyTimingAction()", error);
        }
    }
