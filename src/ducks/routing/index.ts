import {RoutingDetail, RoutingDetailList, RoutingHeader, RoutingHeaderList, RoutingResponse} from "../types";
import {RootState} from "../../app/configureStore";
import {SortProps} from "chums-types";
import {getPreference, localStorageKeys} from "../../api/preferences";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {fetchRouting, fetchRoutings} from "../../api/routing";
import {routingDetailKey, routingDetailSorter, routingHeaderSorter} from "./utils";
import {loadOperationCode} from "../operationCodes";

export interface RoutingState {
    list: RoutingHeaderList;
    loaded: boolean;
    loading: boolean;
    current: {
        header: RoutingHeader | null;
        detail: RoutingDetail[];
        loading: boolean;
    }
    detailList: RoutingDetailList;
    search: string;
    showInactive: boolean;
    page: number;
    rowsPerPage: number;
    sort: SortProps<RoutingHeader>;
}

export const initialState = (): RoutingState => ({
    list: {},
    loaded: false,
    loading: false,
    current: {
        header: null,
        detail: [],
        loading: false,
    },
    detailList: {},
    search: '',
    showInactive: getPreference(localStorageKeys.routingShowInactive, false),
    page: 0,
    rowsPerPage: getPreference(localStorageKeys.routingRowsPerPage, 25),
    sort: {field: 'RoutingNo', ascending: true}
});

export const setSearch = createAction<string>('routing/filter/setSearch');
export const toggleShowInactive = createAction<boolean | undefined>('routing/filter/toggleShowInactive');
export const setPage = createAction<number>('routing/setPage');
export const setRowsPerPage = createAction<number>('routing/setRowsPerPage');
export const setSort = createAction<SortProps<RoutingHeader>>('routing/setSort');

export const loadRoutings = createAsyncThunk<RoutingHeader[]>(
    'routing/load',
    async () => {
        return await fetchRoutings()
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const setCurrentRouting = createAsyncThunk<RoutingResponse | null, RoutingHeader>(
    'routing/current/load',
    async (arg) => {
        return await fetchRouting(arg.RoutingNo);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCurrentLoading(state);
        }
    }
)

const routingReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadRoutings.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadRoutings.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = {}
            action.payload.forEach(row => {
                state.list[row.RoutingNo] = row;
            })
            if (state.current.header) {
                const current = state.list[state.current.header.RoutingNo];
                if (current?.RoutingNo !== state.current.header.RoutingNo) {
                    state.current.detail = [];
                }
                state.current.detail.forEach(row => {
                    state.detailList[routingDetailKey(row)] = row;
                })
                state.current.header = current ?? null;
            }
        })
        .addCase(loadRoutings.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loadOperationCode.fulfilled, (state, action) => {
            action.payload?.whereUsed.forEach(row => {
                state.detailList[routingDetailKey(row)] = row;
            })
        })
        .addCase(setCurrentRouting.pending, (state, action) => {
            state.current.header = action.payload ?? null;
            state.current.loading = true;
        })
        .addCase(setCurrentRouting.fulfilled, (state, action) => {
            state.current.loading = false;
            const [header] = action.payload?.routingHeader ?? [];
            state.current.header = header ?? null;
            state.current.detail = action.payload?.routingDetail ?? [];
            const detailKeys = action.payload?.routingDetail?.map(row => routingDetailKey(row)) ?? [];
            action.payload?.routingDetail.forEach(row => {
                state.detailList[routingDetailKey(row)] = row;
            })
        })
        .addCase(setCurrentRouting.rejected, (state) => {
            state.current.loading = false;
        })
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
            state.page = 0;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
            state.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.page = 0;
            state.rowsPerPage = action.payload;
        })
})

export const selectRoutings = (state: RootState): RoutingHeader[] => {
    return Object.values(state.routing.list).sort(routingHeaderSorter(state.routing.sort));
}

export const selectLoading = (state: RootState): boolean => state.routing.loading;
export const selectLoaded = (state: RootState): boolean => state.routing.loaded;
export const selectCurrentLoading = (state: RootState) => state.routing.current.loading;
export const selectCurrent = (state: RootState) => state.routing.current;
export const routingHeaderSelector = (routingNo: string) => (state: RootState): RoutingHeader | null => {
    return state.routing.list[routingNo] || null;
}
export const selectCurrentHeader = (state: RootState): RoutingHeader | null => state.routing.current.header;

export const selectRoutingDetailList = (state: RootState): RoutingDetail[] => Object.values(state.routing.detailList);

export const selectWhereUsedByRoutingKeys = (state: RootState, keyList: string[]): RoutingDetail[] => {
    return keyList.filter(key => !!state.routing.detailList[key]).map(key => state.routing.detailList[key]);
}
export const selectCurrentDetail = (state: RootState, sort: SortProps<RoutingDetail>): RoutingDetail[] => [...state.routing.current.detail].sort(routingDetailSorter(sort));
export const selectPage = (state: RootState) => state.routing.page;
export const selectRowsPerPage = (state: RootState) => state.routing.rowsPerPage;
export const selectSearch = (state: RootState): string => state.routing.search;
export const selectShowInactive = (state: RootState): boolean => state.routing.showInactive;
export const selectSort = (state: RootState) => state.routing.sort
export const selectSortedRoutingList = createSelector(
    [selectRoutings, selectSearch, selectShowInactive, selectSort],
    (list, search, showInactive, sort) => {
        let regEx = /^/i;
        try {
            if (search) {
                regEx = new RegExp('search', 'i');
            }
        } catch (err: unknown) {
        }
        return list
            .filter(row => showInactive || (row.BillStatus && row.ItemStatus))
            .filter(row => !search || regEx.test(row.RoutingNo) || regEx.test(row.StepDescription))
            .sort(routingHeaderSorter(sort));
    }
)

export default routingReducer;
