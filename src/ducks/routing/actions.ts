import {
    filterActiveChanged,
    filterChanged,
    loadingSelector,
    loadListFailed,
    loadListRequested,
    loadListSucceeded, loadRoutingFailed, loadRoutingRequested,
    loadRoutingSucceeded, RoutingAction,
    routingSelected,
    RoutingThunkAction,
    selectedLoadingSelector
} from "./index";
import {fetchJSON} from 'chums-ducks';
import {RoutingHeader} from "./types";

const routingListUrl = (routingNo?: string) => `/api/operations/production/wo/chums/routings/${encodeURIComponent(routingNo || '')}`;

export const filterChangedAction = (filter:string):RoutingAction => ({type: filterChanged, payload: {filter}});
export const toggleFilterActiveAction = () => ({type: filterActiveChanged});

export const selectRoutingAction = (routingHeader: RoutingHeader): RoutingThunkAction =>
    async (dispatch, getState) => {
        try {
            dispatch({type: routingSelected, payload: {routing: {header: routingHeader}}});
            dispatch(fetchRoutingAction(routingHeader));

        } catch (err) {
            console.log("selectRoutingAction()", err.message);
            return Promise.reject(err);
        }
    }

export const fetchRoutingAction = (header: RoutingHeader): RoutingThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectedLoadingSelector(state);
            if (loading) {
                return;
            }
            dispatch({type: loadRoutingRequested});
            const url = routingListUrl(header.RoutingNo);
            const {
                routingHeader,
                routingDetail,
                whereUsed,
                whereUsedOption
            } = await fetchJSON(url, {cache: 'no-cache'});
            const routing = {
                header: routingHeader[0] || null,
                detail: routingDetail || [],
                whereUsed: whereUsed || [],
                whereUsedInOptions: whereUsedOption || []
            };
            dispatch({type: loadRoutingSucceeded, payload: {routing}});
        } catch (err) {
            console.log("fetchRoutingAction()", err.message);
            dispatch({type: loadRoutingFailed, payload: {error: err, context: loadRoutingRequested}})
        }
    }

export const fetchRoutingsAction = (): RoutingThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = loadingSelector(state);
            if (loading) {
                return;
            }
            dispatch({type: loadListRequested});
            const url = routingListUrl();
            const {routingHeader} = await fetchJSON(url, {cache: 'no-cache'});
            dispatch({type: loadListSucceeded, payload: {list: routingHeader}});
        } catch (err) {
            console.log("fetchRoutingsAction()", err.message);
            dispatch({type: loadListFailed, payload: {error: err, context: loadListRequested}})
        }
    }
