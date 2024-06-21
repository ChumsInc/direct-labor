import {DLCodeList} from "../types";
import {selectCurrentHeader, selectCurrentLoading, selectCurrentSaving, selectLoading,} from "./selectors";
import {AddDLStepArg, DLCodeResponse} from "./types";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {SortProps} from "chums-components";
import {
    deleteStep,
    fetchDLCode,
    fetchDLCodeList,
    postAddStep,
    postDLCode,
    postRecalculateDLCode,
    postRecalculateDLCodes,
    postStepSort
} from "./api";
import {RootState} from "../../app/configureStore";
import {DLCode, DLCodeStep} from "chums-types";
import {newDLCode} from "./utils";

export const setWorkCenterFilter = createAction<string>('dlCodes/filter/workCenter');
export const toggleShowInactive = createAction<boolean | undefined>('dlCodes/filter/toggleShowInactive');
export const setSearch = createAction<string>('dlCodes/filter/setSearch');
export const setPage = createAction<number>('dlCodes/setPage');
export const setRowsPerPage = createAction<number>('dlCodes/setRowsPerPage');
export const setSort = createAction<SortProps<DLCode>>('dlCodes/setSort');
export const loadDLCodes = createAsyncThunk<DLCodeList>(
    'dlCodes/list/load',
    async () => {
        return await fetchDLCodeList() ?? {};
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const loadDLCode = createAsyncThunk<DLCodeResponse | null, number|string>(
    'dlCodes/selected/load',
    async (arg) => {
        if (!arg || arg === '0') {
            return {
                dlCode: {...newDLCode},
                steps: []
            }
        }
        return await fetchDLCode(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    }
)

export const saveDLCode = createAsyncThunk<DLCodeResponse | null, DLCode>(
    'dlCodes/selected/save',
    async (arg) => {
        return await postDLCode(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    }
)

export const addDLStep = createAsyncThunk<DLCodeResponse | null, AddDLStepArg>(
    'dlCodes/selected/addStep',
    async (arg) => {
        return await postAddStep(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            if (!arg.id || !arg.stepId) {
                return false;
            }
            return !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    }
)

export const saveDLStepSort = createAsyncThunk<DLCodeResponse | null, DLCodeStep[]>(
    'dlCodes/selected/saveStepSort',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const current = selectCurrentHeader(state);
        return await postStepSort(current!.id, arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const header = selectCurrentHeader(state);
            return !!header && !!header.id && !!arg.length && !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    }
)

export const removeDLStep = createAsyncThunk<DLCodeResponse | null, DLCodeStep>(
    'dlCodes/selected/removeStep',
    async (arg) => {
        return await deleteStep(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.id && !!arg.stepId && !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    }
)

export const recalcDLCodes = createAsyncThunk<DLCodeList>(
    'dlCodes/recalculate',
    async () => {
        return await postRecalculateDLCodes();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const rebuildDLCode = createAsyncThunk<DLCodeResponse | null, number>(
    'dlCodes/rebuildCost',
    async (arg) => {
        return await postRecalculateDLCode(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    }
)
