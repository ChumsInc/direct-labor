import type {SaveTimingResponse, StepTimingId, TimingEntry} from "./types";
import {selectCurrentTimingStatus} from "./selectors";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import type {DLStep, SortProps, StepTiming} from "chums-types";
import {fetchTiming, postApplyTiming, postTiming} from "./api";
import type {RootState} from "@/app/configureStore";

export const timingSortChangedAction = createAction<SortProps<StepTiming>>('timings/setSort');
export const setCurrentTiming = createAction<StepTiming|null>('timings/current/set');
export const updateCurrentTiming = createAction<Partial<StepTiming>>('timings/current/update');
export const updateTimingEntry = createAction<TimingEntry>('timings/current/updateEntry');

export const loadTiming = createAsyncThunk<StepTiming | null, StepTimingId>(
    'timings/current/load',
    async (arg) => {
        return fetchTiming(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.idSteps
                && !!arg.id
                && selectCurrentTimingStatus(state) === 'idle';
        }
    }
)

export const saveTiming = createAsyncThunk<SaveTimingResponse | null, StepTiming>(
    'timings/current/save',
    async (arg) => {
        return await postTiming(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState
            return !!arg.idSteps
                && selectCurrentTimingStatus(state) === 'idle';
        }
    }
)

export const applyTiming = createAsyncThunk<DLStep | null, StepTiming>(
    'timings/apply',
    async (arg) => {
        return await postApplyTiming(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.idSteps && selectCurrentTimingStatus(state) === 'idle';
        }
    }
)
