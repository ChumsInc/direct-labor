import {
    filterActiveChanged,
    filterChanged,
    loadingSelector,
    loadListFailed,
    loadListRequested,
    loadListSucceeded,
    loadRoutingFailed,
    loadRoutingRequested,
    loadRoutingSucceeded,
    RoutingAction,
    routingSelected,
    RoutingThunkAction,
    selectedLoadingSelector
} from "./index";
import {fetchJSON} from 'chums-ducks';
import {
    BillHeader,
    BillHeaderList,
    BillOptionHeader,
    BillOptionHeaderList,
    RoutingHeader,
    RoutingHeaderList
} from "../types";
import {billHeaderKey, billOptionHeaderKey,} from "../billMaterials/types";

const routingListUrl = (routingNo?: string) => `/api/operations/production/wo/chums/routings/${encodeURIComponent(routingNo || '')}`;

export const filterChangedAction = (filter: string): RoutingAction => ({type: filterChanged, payload: {filter}});
export const toggleFilterActiveAction = () => ({type: filterActiveChanged});

export const selectRoutingAction = (routingHeader: RoutingHeader | null): RoutingThunkAction =>
    async (dispatch, getState) => {
        try {
            dispatch({type: routingSelected, payload: {routing: {header: routingHeader}}});
            if (routingHeader) {
                dispatch(fetchRoutingAction(routingHeader));
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log("selectRoutingAction()", error.message);
                return Promise.reject(error);
            }
            console.error(error);
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
            const whereUsedList: BillHeaderList = {};
            whereUsed.forEach((row: BillHeader) => {
                whereUsedList[billHeaderKey(row)] = row;
            });
            const whereUsedOptionList: BillOptionHeaderList = {};
            whereUsedOption.forEach((row: BillOptionHeader) => {
                whereUsedOption[billOptionHeaderKey(row)] = row;
            });
            const routing = {
                header: routingHeader[0] || null,
                detail: routingDetail || [],
                whereUsed: whereUsedList,
                whereUsedInOptions: whereUsedOptionList,
            };
            dispatch({type: loadRoutingSucceeded, payload: {routing}});
        } catch (err) {
            if (err instanceof Error) {
                console.log("fetchRoutingAction()", err.message);
                return dispatch({type: loadRoutingFailed, payload: {error: err, context: loadRoutingRequested}});
            }
            console.error(err);
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
            const list: RoutingHeaderList = {};
            routingHeader.forEach((routing: RoutingHeader) => {
                list[routing.RoutingNo] = routing;
            })
            dispatch({type: loadListSucceeded, payload: {list}});
        } catch (err) {
            if (err instanceof Error) {
                console.log("fetchRoutingsAction()", err.message);
                return dispatch({type: loadListFailed, payload: {error: err, context: loadListRequested}})
            }
            console.error(err);
        }
    }
