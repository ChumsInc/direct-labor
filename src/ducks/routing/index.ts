import type {RoutingDetailList, RoutingHeaderList} from "../types";
import type {RoutingDetail, RoutingHeader, SortProps} from "chums-types";
import {getPreference, localStorageKeys} from "../../api/preferences";
import {createReducer} from "@reduxjs/toolkit";
import {routingDetailKey} from "./utils";
import {loadOperationCode} from "../operationCodes/actions";
import {
    loadRoutings,
    setCurrentRouting,
    setPage,
    setRowsPerPage,
    setSearch,
    setSort,
    toggleShowInactive
} from "./actions";

export interface RoutingState {
    list: {
        routings: RoutingHeaderList;
        loading: 'idle'|'pending';
        loaded: boolean;
        search: string;
        showInactive: boolean;
        page: number;
        rowsPerPage: number;
        sort: SortProps<RoutingHeader>;
    }
    current: {
        routingNo: string|null;
        header: RoutingHeader | null;
        detail: RoutingDetail[];
        loading: 'idle'|'pending';
    }
    detailList: RoutingDetailList;
}

export const initialState = (): RoutingState => ({
    list: {
        routings: {},
        loaded: false,
        loading: 'idle',
        search: '',
        showInactive: getPreference(localStorageKeys.routingShowInactive, false),
        page: 0,
        rowsPerPage: getPreference(localStorageKeys.routingRowsPerPage, 25),
        sort: {field: 'RoutingNo', ascending: true}
    },
    current: {
        routingNo: null,
        header: null,
        detail: [],
        loading: 'idle',
    },
    detailList: {},
});


const routingReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadRoutings.pending, (state) => {
            state.list.loading = 'pending';
        })
        .addCase(loadRoutings.fulfilled, (state, action) => {
            state.list.loading = 'idle';
            state.list.loaded = true;
            state.list.routings = {}
            action.payload.forEach(row => {
                state.list.routings[row.RoutingNo] = row;
            })
            if (state.current.header) {
                const current = state.list.routings[state.current.header.RoutingNo];
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
            state.list.loading = 'idle';
        })
        .addCase(loadOperationCode.fulfilled, (state, action) => {
            action.payload?.whereUsed.forEach(row => {
                state.detailList[routingDetailKey(row)] = row;
            })
        })
        .addCase(setCurrentRouting.pending, (state, action) => {
            state.current.routingNo = action.meta.arg;
            state.current.header = state.list.routings[action.meta.arg] ?? null;
            state.current.loading = 'pending';
        })
        .addCase(setCurrentRouting.fulfilled, (state, action) => {
            state.current.loading = 'idle';
            const [header] = action.payload?.routingHeader ?? [];
            state.current.header = header ?? null;
            state.current.detail = action.payload?.routingDetail ?? [];
            action.payload?.routingDetail.forEach(row => {
                state.detailList[routingDetailKey(row)] = row;
            })
        })
        .addCase(setCurrentRouting.rejected, (state) => {
            state.current.loading = 'idle';
        })
        .addCase(setSearch, (state, action) => {
            state.list.search = action.payload;
            state.list.page = 0;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.list.showInactive = action.payload ?? !state.list.showInactive;
            state.list.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.list.sort = action.payload;
            state.list.page = 0;
        })
        .addCase(setPage, (state, action) => {
            state.list.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.list.page = 0;
            state.list.rowsPerPage = action.payload;
        })
})

export default routingReducer;
