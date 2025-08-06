import type {SortProps, StepTiming} from "chums-types";
import {loadDLStep} from "../dlSteps/actions";
import {createReducer} from "@reduxjs/toolkit";
import {loadTiming, saveTiming, setCurrentTiming, updateCurrentTiming, updateTimingEntry} from "./actions";
import {timingsSorter} from "./utils";
import {averageMinutes, calcStandardAllowedMinutes} from "@/utils/math";

export interface TimingsState {
    stepId: number;
    list: StepTiming[];
    current: {
        stepTiming: StepTiming | null;
        changed: boolean;
        actionStatus: 'idle' | 'pending' | 'loading' | 'saving';
    };
    edit: boolean;
    sort: SortProps<StepTiming>;
}

const defaultTimingSort: SortProps<StepTiming> = {
    field: 'id',
    ascending: true,
}

const initialTimingsState: TimingsState = {
    stepId: 0,
    list: [],
    current: {
        stepTiming: null,
        changed: false,
        actionStatus: 'idle',
    },
    edit: false,
    sort: {...defaultTimingSort}
}

const timingsReducer = createReducer(initialTimingsState, builder => {
    builder
        .addCase(loadDLStep.pending, (state, action) => {
            if (state.stepId !== +action.meta.arg) {
                state.current.stepTiming = null;
                state.list = [];
            }
        })
        .addCase(loadDLStep.fulfilled, (state, action) => {
            state.list = action.payload?.timings ?? [];
        })
        .addCase(setCurrentTiming, (state, action) => {
            state.current.stepTiming = action.payload;
            state.current.changed = false;

        })
        .addCase(updateCurrentTiming, (state, action) => {
            if (state.current.stepTiming) {
                state.current.stepTiming = {...state.current.stepTiming, ...action.payload};
                state.current.stepTiming.avgTiming = averageMinutes(state.current.stepTiming.entries);
                state.current.stepTiming.standardAllowedMinutes = calcStandardAllowedMinutes(state.current.stepTiming.entries, state.current.stepTiming.quantityPerTiming, state.current.stepTiming.efficiency);
                state.current.changed = true;
            }
        })
        .addCase(loadTiming.pending, (state) => {
            state.current.actionStatus = 'loading';
        })
        .addCase(loadTiming.fulfilled, (state, action) => {
            state.current.actionStatus = 'idle';
            if (action.payload) {
                state.current.stepTiming = action.payload;
            } else {
                state.current.stepTiming = null;
            }
        })
        .addCase(loadTiming.rejected, (state) => {
            state.current.actionStatus = 'idle';
        })
        .addCase(saveTiming.pending, (state) => {
            state.current.actionStatus = 'saving';
        })
        .addCase(saveTiming.fulfilled, (state, action) => {
            state.current.actionStatus = 'idle';
            if (action.payload?.timing) {
                state.current.stepTiming = action.payload.timing;
            }
            state.list = (action.payload?.timings ?? []).sort(timingsSorter(defaultTimingSort))
        })
        .addCase(saveTiming.rejected, (state) => {
            state.current.actionStatus = 'idle';
        })
        .addCase(updateTimingEntry, (state, action) => {
            if (state.current.stepTiming) {
                if (action.payload.index === null) {
                    state.current.stepTiming.entries.push(action.payload.value ?? 0);
                } else if (state.current.stepTiming.entries[action.payload.index] !== undefined) {
                    if (action.payload.value === null) {
                        state.current.stepTiming.entries.splice(action.payload.index, 1);
                    } else {
                        state.current.stepTiming.entries[action.payload.index] = action.payload.value;
                    }
                }
                state.current.stepTiming.avgTiming = averageMinutes(state.current.stepTiming.entries);
                state.current.stepTiming.standardAllowedMinutes = calcStandardAllowedMinutes(state.current.stepTiming.entries, state.current.stepTiming.quantityPerTiming, state.current.stepTiming.efficiency);
            }
        })
})

export default timingsReducer;
