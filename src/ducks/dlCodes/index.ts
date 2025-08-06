import {defaultDLCodeSort, dlCodeSorter, dlCodeStepSorter} from "./utils";
import type {DLCode, DLCodeStep, DLCodeWorkTemplate, SortProps} from "chums-types";
import {getPreference, localStorageKeys, setPreference} from "@/api/preferences";
import {createReducer} from "@reduxjs/toolkit";
import {
    addDLStep,
    loadDLCode,
    loadDLCodes,
    rebuildDLCode,
    recalculateDLCodes,
    removeDLCode,
    removeDLStep,
    saveDLCode,
    saveDLStepSort,
    setSearch,
    setSort,
    setWorkCenterFilter,
    toggleShowInactive
} from "./actions";

export interface DLCodesState {
    list: {
        values: DLCode[];
        status: 'idle' | 'loading' | 'calculating' | 'rejected';
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
        templates: DLCodeWorkTemplate[];
        status: 'idle' | 'loading' | 'saving' | 'deleting';
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
        templates: [],
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
                state.current.templates = header?.templates ?? [];
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
            state.current.templates = header?.templates ?? []
        })
        .addCase(loadDLCode.fulfilled, (state, action) => {
            state.current.status = 'idle';
            state.current.id = action.payload?.dlCode?.id ?? 0;
            state.current.header = action.payload?.dlCode ?? null;
            state.current.templates = action.payload?.dlCode?.templates ?? [];
            state.current.steps = action.payload?.steps.sort(dlCodeStepSorter) ?? [];
            if (action.payload?.dlCode) {
                // do something here?
            }
        })
        .addCase(loadDLCode.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(saveDLCode.pending, (state) => {
            state.current.status = 'saving';
        })
        .addCase(saveDLCode.fulfilled, (state, action) => {
            state.current.status = 'idle';
            if (action.payload) {
                state.current.header = action.payload.dlCode ?? null;
                state.current.templates = action.payload?.dlCode?.templates ?? [];
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
        .addCase(addDLStep.pending, (state) => {
            state.current.status = 'saving';
        })
        .addCase(addDLStep.fulfilled, (state, action) => {
            state.current.status = 'idle';
            if (action.payload) {
                state.current.header = action.payload?.dlCode ?? null;
                state.current.templates = action.payload?.dlCode?.templates ?? [];
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
        .addCase(rebuildDLCode.pending, (state, ) => {
            state.current.status = 'loading';
        })
        .addCase(rebuildDLCode.fulfilled, (state, action) => {
            state.current.status = 'idle';
            if (action.payload) {
                state.current.header = action.payload.dlCode ?? null;
                state.current.templates = action.payload?.dlCode?.templates ?? [];
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
        .addCase(saveDLStepSort.pending, (state, ) => {
            state.current.status = 'saving';
        })
        .addCase(saveDLStepSort.fulfilled, (state, action) => {
            state.current.status = 'idle';
            if (action.payload) {
                state.current.header = action.payload?.dlCode ?? null;
                state.current.templates = action.payload?.dlCode?.templates ?? [];
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
        .addCase(removeDLStep.pending, (state, ) => {
            state.current.status = 'saving';
        })
        .addCase(removeDLStep.fulfilled, (state, action) => {
            state.current.status = 'idle';
            if (action.payload) {
                state.current.header = action.payload?.dlCode ?? null;
                state.current.templates = action.payload?.dlCode?.templates ?? [];
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
        .addCase(recalculateDLCodes.pending, (state) => {
            state.list.status = 'calculating';
        })
        .addCase(recalculateDLCodes.fulfilled, (state, action) => {
            state.list.status = 'idle';
            state.list.values = action.payload.sort(dlCodeSorter(defaultDLCodeSort));
            if (state.current.header) {
                const [current] = state.list.values.filter(row => row.id === state.current.id);
                state.current.header = current ?? null;
                state.current.templates = current?.templates ?? [];
            }
        })
        .addCase(recalculateDLCodes.rejected, (state) => {
            state.list.status = 'idle';
        })
        .addCase(removeDLCode.pending, (state) => {
            state.current.status = 'deleting';
        })
        .addCase(removeDLCode.fulfilled, (state, action) => {
            state.current.status = 'idle';
            state.current.header = null;
            state.current.templates = [];
            state.current.steps = [];
            state.list.values = state.list.values.filter(row => row.id !== action.meta.arg);
        })
        .addCase(removeDLCode.rejected, (state) => {
            state.current.status = 'idle';
        })

});

export default dlCodesReducer;
