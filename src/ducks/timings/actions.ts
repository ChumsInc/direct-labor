import {FetchTimingArg, SaveTimingResponse} from "../types";
import {selectCurrentLoading, selectCurrentSaving} from "./selectors";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {fetchTimings, postApplyTiming, postTiming} from "../../api/timings";
import {DLStep, StepTiming} from "chums-types";

const timingsURL = (id: number, idTimings?: number) => `/api/operations/production/dl/steps/${encodeURIComponent(id)}/timings/${encodeURIComponent(idTimings || '')}`;
const applyTimingsURL = (id: number, idTiming: number) => `/api/operations/production/dl/steps/${encodeURIComponent(id)}/timing/${encodeURIComponent(idTiming)}`;

export const setCurrentTiming = createAction<StepTiming | null>('timings/current/set');
export const changeTiming = createAction<Partial<StepTiming>>('timings/current/change');

export const loadTimings = createAsyncThunk<StepTiming[], FetchTimingArg>(
    'timings/load',
    async (arg) => {
        return await fetchTimings(arg);
    }
    , {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.stepId && !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    })

export const saveTiming = createAsyncThunk<SaveTimingResponse, StepTiming>(
    'timings/current/save',
    async (arg) => {
        arg.entries = arg.entries.filter(val => !!val);
        return await postTiming(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    }
)

export const applyTiming = createAsyncThunk<DLStep | null, StepTiming>(
    'timings/apply-timing',
    async (arg) => {
        return await postApplyTiming(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.id && !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    }
)
