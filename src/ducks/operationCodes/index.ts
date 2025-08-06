import {routingDetailKey} from "../routing/utils";
import type {OperationCode, SortProps,} from "chums-types";
import {createReducer} from "@reduxjs/toolkit";
import {operationCodeDefaultSort, operationCodeKey} from "./utils";
import {loadOperationCode, loadOperationCodes, setSearch, setSort, setWorkCenter} from "./actions";

export interface OperationCodesState {
    list: {
        values: OperationCode[];
        status: 'idle' | 'loading';
        sort: SortProps<OperationCode>
        loaded: boolean;
        filters: {
            search: string;
            workCenter: string;
        }
    }
    current: {
        key: string;
        value: OperationCode | null;
        status: 'idle' | 'loading';
        whereUsed: string[];
    }
}

export const initialState = (): OperationCodesState => ({
    list: {
        values: [],
        status: 'idle',
        sort: {...operationCodeDefaultSort},
        loaded: false,
        filters: {
            search: '',
            workCenter: '',
        }
    },
    current: {
        key: '',
        value: null,
        status: 'idle',
        whereUsed: [],
    },
})

const operationCodesReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadOperationCodes.pending, (state) => {
            state.list.status = 'loading';
        })
        .addCase(loadOperationCodes.fulfilled, (state, action) => {
            state.list.status = 'idle';
            state.list.values = action.payload?.operationCodes ?? [];
            if (state.current.key) {
                const [current] = state.list.values.filter(row => operationCodeKey(row) === state.current.key);
                if (!current) {
                    state.current.key = '';
                }
                state.current.value = current ?? null;
            }
        })
        .addCase(loadOperationCodes.rejected, (state) => {
            state.list.status = 'idle';
        })
        .addCase(loadOperationCode.pending, (state, action) => {
            if (state.current.key !== operationCodeKey(action.meta.arg)) {
                state.current.whereUsed = [];
            }
            state.current.key = operationCodeKey(action.meta.arg);
            const [current] = state.list.values.filter(row => operationCodeKey(row) === state.current.key);
            state.current.value = current ?? null;
            state.current.status = 'loading';
        })
        .addCase(loadOperationCode.fulfilled, (state, action) => {
            state.current.status = 'idle';
            if (action.payload) {
                state.current.value = action.payload.operationCodes[0] ?? null;
                state.current.whereUsed = action.payload.whereUsed.map(rd => routingDetailKey(rd)).sort();
            }
        })
        .addCase(setSearch, (state, action) => {
            state.list.filters.search = action.payload;
        })
        .addCase(setWorkCenter, (state, action) => {
            state.list.filters.workCenter = action.payload;
        })
        .addCase(setSort, (state, action) => {
            state.list.sort = action.payload;
        })
})

export default operationCodesReducer;
