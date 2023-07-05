import {stepTimingChanged} from "../dlSteps/actionTypes";
import {
    changeTiming,
    editTiming,
    loadTimingEntriesFailed,
    loadTimingEntriesRequested,
    loadTimingEntriesSucceeded,
    saveTimingEntriesFailed,
    saveTimingEntriesRequested,
    saveTimingEntriesSucceeded,
    timingsSelectTiming
} from "./actionTypes";
import {SortProps, StepTiming} from "chums-types";
import {createReducer} from "@reduxjs/toolkit";
import {loadDLStepAction} from "../dlSteps/actions";
import {loadTimings} from "./actions";

export interface TimingsState {
    list: StepTiming[];
    loading: boolean;
    current: {
        timing: StepTiming | null;
        changed: boolean;
        loading: boolean;
        saving: boolean;
    }
    edit: boolean;
    sort: SortProps<StepTiming>;
}

export const defaultTimingSort: SortProps<StepTiming> = {field: 'id', ascending: true};

export const initialTimingsState: TimingsState = {
    list: [],
    loading: false,
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
        .addCase(loadTimings.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadTimings.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(loadTimings.rejected, (state) => {
            state.loading = false;
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
                        state.list = [...action.payload.timings];
                        const [timing] = action.payload.timings.filter((t: StepTiming) => t.id === state.current.timing?.id);
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
                        state.current.timing = {...state.current.timing, ...action.payload.change} as StepTiming;
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

