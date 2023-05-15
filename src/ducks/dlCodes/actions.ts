import {DLCode, DLCodeList, DLCodeStep, DLCodeSteps} from "../types";
import {fetchDELETE, fetchJSON, fetchPOST} from "chums-ducks";
import {
    dlCodeChanged,
    deleteStepFailed,
    deleteStepRequested, deleteStepSucceeded,
    dlCodeSelected,
    dlCodeStepOrderChanged,
    filterChanged,
    filterInactiveChanged,
    loadDLCodeFailed,
    loadDLCodeRequested,
    loadDLCodesFailed,
    loadDLCodesRequested,
    loadDLCodesSucceeded,
    loadDLCodeSucceeded,
    saveDLCodeFailed,
    saveDLCodeRequested,
    saveDLCodeSucceeded,
    sortDLStepFailed,
    sortDLStepRequested,
    sortDLStepSucceeded,
    stepAddFailed,
    stepAddRequested,
    stepAddSucceeded,
    wcFilterChanged
} from "./actionTypes";
import {selectLoading, selectCurrentHeader, selectCurrentLoading, selectCurrentSaving,} from "./selectors";
import {AddDLStepArg, dlCodeKey, DLCodeResponse, DLCodesAction, DLCodesThunkAction} from "./types";
import {dlCodeStepSorter, dlStepList} from "./utils";
import {dlStepKey} from "../dlSteps/types";
import {filterInactiveCodesKey, setPreference} from "../../utils/preferences";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {SortProps} from "chums-components";
import {
    deleteStep,
    fetchDLCode,
    fetchDLCodeList,
    postAddStep,
    postDLCode, postRecalculateDLCode,
    postRecalculateDLCodes,
    postStepSort
} from "../../api/dl-codes";
import {RootState} from "../../app/configureStore";
import {useSelector} from "react-redux";

const dlCodesListURL = (dlCode?: string) => `/api/operations/production/dl/codes/list/${encodeURIComponent(dlCode || '')}`;
const dlCodeURL = (id: string | number) => `/api/operations/production/dl/codes/${encodeURIComponent(id)}`;
const dlCodeStepURL = (id: number | string, stepId: string | number) => `/api/operations/production/dl/codes/${encodeURIComponent(id)}/step/${encodeURIComponent(stepId)}`;
const dlCodeStepsOrderURL = (id: number) => `/api/operations/production/dl/codes/${encodeURIComponent(id)}/steps`;

export const setWorkCenterFilter = createAction<string>('dlCodes/filter/workCenter');
export const toggleShowInactive = createAction<boolean|undefined>('dlCodes/filter/toggleShowInactive');
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

export const loadDLCode = createAsyncThunk<DLCodeResponse|null, DLCode|undefined>(
    'dlCodes/current/load',
    async (arg) => {
        if (!arg) {
            return null;
        }
        return await fetchDLCode(arg.id) ?? null;
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    }
)

export const saveDLCode = createAsyncThunk<DLCodeResponse|null, DLCode>(
    'dlCodes/current/save',
    async (arg) => {
        return await postDLCode(arg) ?? null;
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    }
)

export const addDLStep = createAsyncThunk<DLCodeResponse|null, AddDLStepArg>(
    'dlCodes/current/addStep',
    async (arg) => {
        return await postAddStep(arg) ?? null;
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

export const saveDLStepSort = createAsyncThunk<DLCodeResponse|null, DLCodeStep[]>(
    'dlCodes/current/saveStepSort',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const current = selectCurrentHeader(state);
        return await postStepSort(current!.id, arg) ?? null;
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const header = selectCurrentHeader(state);
            return !!header && !!header.id && !!arg.length && !(selectCurrentLoading(state) || selectCurrentSaving(state));
        }
    }
)

export const removeDLStep = createAsyncThunk<DLCodeResponse|null, DLCodeStep>(
    'dlCodes/current/removeStep',
    async (arg) => {
        return await deleteStep(arg) ?? null;
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

export const rebuildDLCode = createAsyncThunk<DLCodeResponse|null, number>(
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
