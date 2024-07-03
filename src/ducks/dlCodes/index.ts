import {defaultDLCodeSort, dlCodeSorter, dlCodeStepSorter} from "./utils";
import {DLCodeList} from "../types";
import {SortProps} from "chums-components";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {createReducer} from "@reduxjs/toolkit";
import {
    addDLStep,
    loadDLCode,
    loadDLCodes,
    rebuildDLCode,
    recalcDLCodes,
    removeDLStep,
    saveDLCode,
    saveDLStepSort,
    setPage,
    setRowsPerPage,
    setSearch,
    setSort,
    setWorkCenterFilter,
    toggleShowInactive
} from "./actions";
import {DLCode, DLCodeStep} from "chums-types";

export interface DLCodesState {
    list: { 
        values: DLCode[];
        status: 'idle'|'loading'|'calculating';
        loaded: boolean;
        sort: SortProps<DLCode>,
        filters: {
            showInactive: boolean;
            search: string;
            workCenter: string;
        }
    }
    current: {
        id: number;
        header: DLCode | null;
        steps: DLCodeStep[];
        status: 'idle'|'loading'|'saving';
        changed: boolean;
    },
}

const initialState = (): DLCodesState => ({
    list: {
        values: [],
        status: 'idle',
        loaded: false,
        sort: {...defaultDLCodeSort},
        filters: {
            showInactive: getPreference(localStorageKeys.dlCodesShowInactive, false),
            search: '',
            workCenter: getPreference(localStorageKeys.dlCodesWorkCenter, ''),
        }
    },
    current: {
        id: 0,
        header: null,
        steps: [],
        status: 'idle',
        changed: false,
    },
})

const dlCodesReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setWorkCenterFilter, (state, action) => {
            state.list.filters.workCenter = action.payload;
            setPreference(localStorageKeys.dlCodesWorkCenter, action.payload);
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.list.filters.showInactive = action.payload ?? !state.list.filters.showInactive;
            setPreference(localStorageKeys.dlCodesShowInactive, state.list.filters.showInactive);
        })
        .addCase(setSearch, (state, action) => {
            state.list.filters.search = action.payload;
        })
        .addCase(setSort, (state, action) => {
            state.list.sort = action.payload;
        })
        .addCase(loadDLCodes.pending, (state) => {
            state.list.status = 'loading';
        })
        .addCase(loadDLCodes.fulfilled, (state, action) => {
            state.list.status = 'idle';
            state.list.loaded = true;
            state.list.values = [...action.payload].sort(dlCodeSorter(defaultDLCodeSort));
            if (state.current.header) {
                const [header] = state.list.values.filter(row => row.id === state.current.header?.id);
                state.current.header = header ?? null;
                if (!state.current.header) {
                    state.current.steps = [];
                }
            }
        })
        .addCase(loadDLCodes.rejected, (state) => {
            state.list.status = 'idle';
        })
        .addCase(loadDLCode.pending, (state, action) => {
            state.current.id = +action.meta.arg;
            state.current.status = 'loading';
            if (!state.current.id || state.current.header?.id !== state.current.id) {
                state.current.steps = [];
            }
            const [header] = state.list.values.filter(row => row.id === state.current.id);
            state.current.header = header ?? null;
        })
        .addCase(loadDLCode.fulfilled, (state, action) => {
            state.current.status = 'idle';
            state.current.id = action.payload?.dlCode?.id ?? 0;
            state.current.header = action.payload?.dlCode ?? null;
            state.current.steps = action.payload?.steps.sort(dlCodeStepSorter) ?? [];
            if (action.payload?.dlCode) {
            }
        })
        .addCase(loadDLCode.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(saveDLCode.pending, (state, action) => {
            state.current.status = 'saving';
        })
        .addCase(saveDLCode.fulfilled, (state, action) => {
            state.current.status = 'idle';
            if (action.payload) {
                state.current.header = action.payload.dlCode ?? null;
                state.current.steps = action.payload.steps.sort(dlCodeStepSorter) ?? [];
                state.list.values = [
                    ...state.list.values.filter(row => row.id != state.current.id),
                    action.payload.dlCode,
                ].sort(dlCodeSorter(defaultDLCodeSort));
            }
        })
        .addCase(saveDLCode.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(addDLStep.pending, (state, action) => {
            state.current.status = 'saving';
        })
        .addCase(addDLStep.fulfilled, (state, action) => {
            state.current.status = 'idle';
            if (action.payload) {
                state.current.header = action.payload?.dlCode ?? null;
                state.current.steps = action.payload?.steps.sort(dlCodeStepSorter) ?? [];
                state.list.values = [
                    ...state.list.values.filter(row => row.id != state.current.id),
                    action.payload.dlCode,
                ].sort(dlCodeSorter(defaultDLCodeSort));
            }
        })
        .addCase(addDLStep.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(rebuildDLCode.pending, (state, action) => {
            state.current.status = 'loading';
        })
        .addCase(rebuildDLCode.fulfilled, (state, action) => {
            state.current.status = 'idle';
            if (action.payload) {
                state.current.header = action.payload.dlCode ?? null;
                state.current.steps = action.payload.steps.sort(dlCodeStepSorter) ?? [];
                state.list.values = [
                    ...state.list.values.filter(row => row.id != state.current.id),
                    action.payload.dlCode,
                ].sort(dlCodeSorter(defaultDLCodeSort));
            }
        })
        .addCase(rebuildDLCode.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(saveDLStepSort.pending, (state, action) => {
            state.current.status = 'saving';
        })
        .addCase(saveDLStepSort.fulfilled, (state, action) => {
            state.current.status = 'idle';
            if (action.payload) {
                state.current.header = action.payload?.dlCode ?? null;
                state.current.steps = action.payload?.steps.sort(dlCodeStepSorter) ?? [];
                state.list.values = [
                    ...state.list.values.filter(row => row.id != state.current.id),
                    action.payload.dlCode,
                ].sort(dlCodeSorter(defaultDLCodeSort));
            }
        })
        .addCase(saveDLStepSort.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(removeDLStep.pending, (state, action) => {
            state.current.status = 'saving';
        })
        .addCase(removeDLStep.fulfilled, (state, action) => {
            state.current.status = 'idle';
            if (action.payload) {
                state.current.header = action.payload?.dlCode ?? null;
                state.current.steps = action.payload?.steps.sort(dlCodeStepSorter) ?? [];
                state.list.values = [
                    ...state.list.values.filter(row => row.id != state.current.id),
                    action.payload.dlCode,
                ].sort(dlCodeSorter(defaultDLCodeSort));
            }
        })
        .addCase(removeDLStep.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(recalcDLCodes.pending, (state) => {
            state.list.status = 'calculating';
        })
        .addCase(recalcDLCodes.fulfilled, (state, action) => {
            state.list.status = 'idle';
            state.list.values = action.payload.sort(dlCodeSorter(defaultDLCodeSort));
            if (state.current.header) {
                const [current] = state.list.values.filter(row => row.id === state.current.id);
                state.current.header = current ?? null;
            }
        })
        .addCase(recalcDLCodes.rejected, (state) => {
            state.list.status = 'idle';
        })

});

export default dlCodesReducer;
