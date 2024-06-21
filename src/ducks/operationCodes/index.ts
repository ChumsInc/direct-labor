import {routingDetailKey} from "../routing/utils";
import {OperationCodeList} from "../types";
import {getPreference, localStorageKeys} from "../../api/preferences";
import {OperationCode, SortProps,} from "chums-types";
import {createReducer} from "@reduxjs/toolkit";
import {operationCodeDefaultSort, operationCodeKey} from "./utils";
import {
    loadOperationCode,
    loadOperationCodes,
    setPage,
    setRowsPerPage,
    setSearch,
    setSort,
    setWorkCenter
} from "./actions";

export interface OperationCodesState {
    list: OperationCodeList;
    current: {
        value: OperationCode | null;
        loading: boolean;
        whereUsed: string[];
    };
    workCenter: string;
    search: string;
    loading: boolean;
    loaded: boolean;
    page: number;
    rowsPerPage: number;
    sort: SortProps<OperationCode>
}

export const initialState = (): OperationCodesState => ({
    list: {},
    current: {
        value: null,
        loading: false,
        whereUsed: [],
    },
    workCenter: '',
    search: '',
    loading: false,
    loaded: false,
    page: 0,
    rowsPerPage: getPreference(localStorageKeys.opCodesRowsPerPage, 25),
    sort: {...operationCodeDefaultSort},
})

const operationCodesReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadOperationCodes.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadOperationCodes.fulfilled, (state, action) => {
            state.list = {};
            action.payload?.operationCodes?.forEach(row => {
                state.list[operationCodeKey(row)] = row;
            });
            state.loading = false;
            state.loaded = true;
            if (state.current.value) {
                state.current.value = state.list[operationCodeKey(state.current.value)] ?? null;
            }
        })
        .addCase(loadOperationCodes.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loadOperationCode.pending, (state, action) => {
            if (state.current.value && operationCodeKey(state.current.value) !== operationCodeKey(action.meta.arg)) {
                state.current.whereUsed = [];
            }
            state.current.value = state.list[operationCodeKey(action.meta.arg)] ?? null;
            state.current.loading = true;
        })
        .addCase(loadOperationCode.fulfilled, (state, action) => {
            state.current.loading = false;
            if (action.payload) {
                state.current.value = action.payload.operationCodes[0] ?? null;
                state.current.whereUsed = action.payload.whereUsed.map(rd => routingDetailKey(rd)).sort();
            }
        })
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
            state.page = 0;
        })
        .addCase(setWorkCenter, (state, action) => {
            state.workCenter = action.payload;
            state.page = 0;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
})

export default operationCodesReducer;
