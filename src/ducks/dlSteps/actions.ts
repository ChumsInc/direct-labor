import type {LoadDLStepsResponse} from "./types";
import type {DLCode, DLStep} from "chums-types";
import {selectCurrentStepId, selectCurrentStepStatus, selectStepsLoading} from "./index";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import type {RootState} from "@/app/configureStore";
import {fetchDLStep, fetchDLSteps, fetchDLStepWhereUsed, postDLStep} from "./api";

export const changeDLStep = createAction<Partial<DLStep>>('steps/current/change');
export const toggleShowInactive = createAction<boolean | undefined>('steps/showInactive');

export const setCurrentStep = createAction<DLStep>('steps/setCurrentStep');

export const loadDLSteps = createAsyncThunk<LoadDLStepsResponse, void>(
    'steps/list/load',
    async () => {
        return await fetchDLSteps();
    },
    {
        condition: (_, {getState}) => {
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
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentStepStatus(state) === 'idle';
        }
    }
)
