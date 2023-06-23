import {combineReducers} from "redux";
import {DLTiming} from "../types";
import {stepSelected, stepsLoadStepSucceeded, stepTimingChanged} from "../dlSteps/actionTypes";
import {newTiming, TimingsAction} from "./types";
import {
    changeTiming,
    editTiming,
    loadTimingEntriesFailed,
    loadTimingEntriesRequested,
    loadTimingEntriesSucceeded,
    saveTimingEntriesFailed,
    saveTimingEntriesRequested,
    saveTimingEntriesSucceeded,
    timingsSelectedChanged,
    timingsSelectTiming
} from "./actionTypes";
import {SortProps} from "chums-types";
import {createReducer} from "@reduxjs/toolkit";
import {loadDLStepAction} from "../dlSteps/actions";

export interface TimingsState {
    list: DLTiming[];
    current: {
        timing: DLTiming|null;
        changed: boolean;
        loading: boolean;
        saving: boolean;
    }
    edit: boolean;
    sort: SortProps<DLTiming>;
}

export const defaultTimingSort:SortProps<DLTiming> = {field: 'id', ascending: true};

export const initialTimingsState:TimingsState = {
    list: [],
    current: {
        timing: null,
        changed: false,
        loading: false,
        saving: false,
    },
    edit: false,
    sort: {field: 'timingDate', ascending: false},
}

const timingsReducer = createReducer(initialTimingsState, (builder) => {
    builder
        .addCase(loadDLStepAction.pending, (state, action) => {
            state.list = [];
        })
        .addCase(loadDLStepAction.fulfilled, (state, action) => {
            state.list = action.payload.step?.timings ?? [];
            if (state.current) {
                const [timing] = state.list.filter(t => t.id === state.current.timing?.id);
                state.current.timing = timing ?? null;
                state.current.changed = false;
            }
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case loadTimingEntriesRequested:
                    state.current.loading = true;
                    return;
                case loadTimingEntriesFailed:
                    state.current.loading = false
                    return;
                case loadTimingEntriesSucceeded:
                case saveTimingEntriesSucceeded:
                    state.edit = false;
                    state.current.loading = false;
                    state.current.saving = false;
                    if (action.payload?.timings) {
                        state.list =  [...action.payload.timings];
                        const [timing] = action.payload.timings.filter((t:DLTiming) => t.id === state.current.timing?.id);
                        state.current.timing = timing ?? null;
                    }
                    return;
                case timingsSelectTiming:
                    state.current.timing = action.payload?.timings ?? null;
                    state.current.changed = false;
                    return;
                case editTiming:
                    state.current.timing = action.payload?.timing ?? null;
                    state.current.changed = false;
                    return;
                case changeTiming:
                    if (state.current.timing) {
                        state.current.timing = {...state.current.timing, ...action.payload.change} as DLTiming;
                        state.current.changed = true;
                    }
                    return;
                case stepTimingChanged:
                    state.current.timing = action.payload?.timing ?? null;
                    state.current.changed = false;
                    return;
                case saveTimingEntriesRequested:
                    state.current.saving = true;
                    return;
                case saveTimingEntriesFailed:
                    state.current.saving = false;
                    return;

            }
        })
})

export default timingsReducer;

