import {OperationCode, OperationCodeAction, OperationCodeThunkAction} from "./types";
import {
    loadingSelector,
    loadOCFailed,
    loadOCListFailed,
    loadOCListRequested,
    loadOCListSucceeded,
    loadOCRequested, loadOCSucceeded, operationCodeSelected, searchChanged, workCenterChanged,
} from "./index";
import {fetchJSON} from "chums-ducks";


export const operationCodesURL = (oc?:OperationCode) => `/api/operations/production/wo/chums/operation-codes/:workCenter/:operationCode`
    .replace(':workCenter', encodeURIComponent(oc?.WorkCenter || ''))
    .replace(':operationCode', encodeURIComponent(oc?.OperationCode || ''))
    .replace('//', '/');

export const filterChangedAction = (filter:string):OperationCodeAction => ({type: searchChanged, payload: {filter}});
export const workCenterChangedAction = (filter:string):OperationCodeAction => ({type: workCenterChanged, payload: {filter}});

export const selectOperationCodeAction = (oc:OperationCode):OperationCodeThunkAction =>
    (dispatch, getState) => {
        dispatch({type: operationCodeSelected, payload: {selected: oc}});
        dispatch(loadOperationCodeAction(oc));
    }

export const loadOperationCodesAction = ():OperationCodeThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (loadingSelector(state)) {
                return;
            }
            dispatch({type: loadOCListRequested});
            const {operationCodes = []} = await fetchJSON(operationCodesURL(), {cache: 'no-cache'});
            dispatch({type: loadOCListSucceeded, payload: {list: operationCodes}});
        } catch(err) {
            console.log("loadOperationCodesAction()", err.message);
            dispatch({type: loadOCListFailed, payload: {error: err, context: loadOCListRequested}});
        }
    }

export const loadOperationCodeAction = (oc:OperationCode):OperationCodeThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (loadingSelector(state)) {
                return;
            }
            dispatch({type: loadOCRequested});
            const {operationCodes, accounts, whereUsed} = await fetchJSON(operationCodesURL(oc), {cache: 'no-cache'});
            if (!operationCodes.length) {
                return dispatch({type: loadOCSucceeded});
            }
            const [selected] = operationCodes;
            dispatch({type: loadOCSucceeded, payload: {selected, accounts, routings: whereUsed}});

        } catch(err) {
            console.log("loadOperationCodesAction()", err.message);
            dispatch({type: loadOCFailed, payload: {error: err, context: loadOCRequested}});
        }
    }

