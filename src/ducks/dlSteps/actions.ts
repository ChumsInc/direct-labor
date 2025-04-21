import {LoadDLStepsResponse} from "./types";
import {DLBasicStep, DLCode, DLStep, SortProps, StepTiming} from "chums-types";
import {stepTimingChanged} from "./actionTypes";
import {selectCurrentStepId, selectCurrentStepStatus, selectStepsLoading} from "./index";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {fetchDLStep, fetchDLSteps, fetchDLStepWhereUsed, postDLStep} from "./api";

export const changeDLStep = createAction<Partial<DLStep>>('steps/current/change');
export const setStepSort = createAction<SortProps<DLStep | DLBasicStep>>('steps/setSort');
export const setStepWCFilter = createAction<string>('steps/setWCFilter');
export const setStepFilter = createAction<string>('steps/setFilter');
export const toggleShowInactive = createAction<boolean | undefined>('steps/showInactive');
export const setCurrentStepTiming = createAction<StepTiming | null>('steps/current/setTiming');
export const dlStepChangeTimingAction = (timing: StepTiming) => ({type: stepTimingChanged, payload: {timing}});

export const setCurrentStep = createAction<DLStep>('steps/setCurrentStep');

export const loadDLSteps = createAsyncThunk<LoadDLStepsResponse, void>(
    'steps/list/load',
    async () => {
        return await fetchDLSteps();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectStepsLoading(state);
        }
    }
)

export const loadDLStep = createAsyncThunk<DLStep | null, number | string>(
    'steps/current/load',
    async (arg) => {
        return await fetchDLStep(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const status = selectCurrentStepStatus(state);
            const currentId = selectCurrentStepId(state);
            return (+arg) !== 0
                && (status === 'idle' || (status === 'rejected' && currentId !== +arg));
        }
    }
)

export const loadDLStepWhereUsed = createAsyncThunk<DLCode[], number | string>(
    'steps/current/where-used/load',
    async (arg) => {
        return await fetchDLStepWhereUsed(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && selectCurrentStepStatus(state) !== 'saving';
        }
    }
)

export const saveDLStep = createAsyncThunk<DLStep | null, DLStep>(
    'steps/current/save',
    async (arg) => {
        return await postDLStep(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentStepStatus(state) === 'idle';
        }
    }
)
