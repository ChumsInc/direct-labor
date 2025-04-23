import {selectCurrentDLCodeStatus, selectCurrentHeader, selectDLCodesStatus,} from "./selectors";
import {AddDLStepArg, DLCodeResponse} from "./types";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {SortProps} from "chums-components";
import {
    deleteDLCode,
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
export const loadDLCodes = createAsyncThunk<DLCode[]>(
    'dlCodes/list/load',
    async () => {
        return await fetchDLCodeList() ?? {};
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectDLCodesStatus(state) === 'idle';
        }
    }
)

export const loadDLCode = createAsyncThunk<DLCodeResponse | null, number | string>(
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
            return selectCurrentDLCodeStatus(state) === 'idle';
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
            return selectCurrentDLCodeStatus(state) === 'idle';
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
            return selectCurrentDLCodeStatus(state) === 'idle';
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
            return !!header && !!header.id && !!arg.length && selectCurrentDLCodeStatus(state) === 'idle';
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
            return !!arg.id && !!arg.stepId && selectCurrentDLCodeStatus(state) === 'idle';
        }
    }
)

export const recalculateDLCodes = createAsyncThunk<DLCode[]>(
    'dlCodes/recalculate',
    async () => {
        return await postRecalculateDLCodes();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectDLCodesStatus(state) === 'idle';
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
            return !!arg && selectCurrentDLCodeStatus(state) === 'idle';
        }
    }
)

export const removeDLCode = createAsyncThunk<DLCodeResponse|null, number|string, {state:RootState}>(
    'dlCodes/remove',
    async (arg) => {
        return await deleteDLCode(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !!+arg && selectCurrentDLCodeStatus(state) === 'idle';
        }
    }
)
