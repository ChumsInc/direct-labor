import {OperationCodeResponse} from "./types";
import {routingDetailKey} from "../routing/utils";
import {OperationCode, OperationCodeList} from "../types";
import {RootState} from "../../app/configureStore";
import {getPreference, localStorageKeys} from "../../api/preferences";
import {SortProps} from "chums-types";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {fetchOperationCode, fetchOperationCodes} from "../../api/operation-codes";
import {operationCodeDefaultSort, operationCodeKey, operationCodeSorter} from "./utils";
import {selectRoutingDetailList, selectRoutings} from "../routing";

export interface OperationCodesState {
    list: OperationCodeList;
    current: {
        value: OperationCode | null;
        loading: boolean;
        whereUsed: string[];
    };
    workCenter: string;
    search: string;
    loading: boolean;
    loaded: boolean;
    page: number;
    rowsPerPage: number;
    sort: SortProps<OperationCode>
}

export const initialState = (): OperationCodesState => ({
    list: {},
    current: {
        value: null,
        loading: false,
        whereUsed: [],
    },
    workCenter: '',
    search: '',
    loading: false,
    loaded: false,
    page: 0,
    rowsPerPage: getPreference(localStorageKeys.opCodesRowsPerPage, 25),
    sort: {...operationCodeDefaultSort},
})

export const setSearch = createAction<string>('operationCodes/filter/setSearch')
export const setWorkCenter = createAction<string>('operationCodes/filter/setWorkCenter');
export const setPage = createAction<number>('operationCodes/setPage');
export const setRowsPerPage = createAction<number>('operationCodes/setRowsPerPage');
export const setSort = createAction<SortProps<OperationCode>>('operationCodes/setSort');
export const loadOperationCodes = createAsyncThunk<OperationCodeResponse | null>(
    'operationCodes/load',
    async () => {
        //@TODO: implement on glAccounts reducer
        return await fetchOperationCodes();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const loadOperationCode = createAsyncThunk<OperationCodeResponse | null, OperationCode|undefined>(
    'operationCodes/current/load',
    async (arg) => {
        if (!arg) {
            return null;
        }
        //@TODO: implement on glAccounts.list reducer, routing.detail reducer
        return await fetchOperationCode(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCurrentLoading(state);
        }
    }
)

const operationCodesReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadOperationCodes.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadOperationCodes.fulfilled, (state, action) => {
            state.list = {};
            action.payload?.operationCodes?.forEach(row => {
                state.list[operationCodeKey(row)] = row;
            });
            state.loading = false;
            state.loaded = true;
            if (state.current.value) {
                state.current.value = state.list[operationCodeKey(state.current.value)] ?? null;
            }
        })
        .addCase(loadOperationCodes.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loadOperationCode.pending, (state, action) => {
            if (state.current.value && operationCodeKey(state.current.value) !== operationCodeKey(action.meta.arg)) {
                state.current.whereUsed = [];
            }
            state.current.value = action.meta.arg ?? null;
            state.current.loading = true;
        })
        .addCase(loadOperationCode.fulfilled, (state, action) => {
            state.current.loading = false;
            if (action.payload) {
                state.current.value = action.payload.operationCodes[0] ?? null;
                state.current.whereUsed = action.payload.whereUsed.map(rd => routingDetailKey(rd)).sort();
            }
        })
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
            state.page = 0;
        })
        .addCase(setWorkCenter, (state, action) => {
            state.workCenter = action.payload;
            state.page = 0;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
})

export const loadOCSucceeded = 'operationCodes/loadCodeSucceeded';

export const selectOperationCodesList = (state: RootState) => state.operationCodes.list;

export const listSelector = (state: RootState): OperationCode[] => Object.values(state.operationCodes.list)
    .sort(operationCodeSorter(operationCodeDefaultSort));


export const selectWorkCenter = (state: RootState): string => state.operationCodes.workCenter;
export const selectSearch = (state: RootState): string => state.operationCodes.search;
export const selectSearchRegex = (state: RootState): RegExp => {
    try {
        return new RegExp(state.operationCodes.search, 'i');
    } catch (err) {
        return /^/;
    }
}
export const selectPage = (state: RootState): number => state.operationCodes.page;
export const selectRowsPerPage = (state: RootState) => state.operationCodes.rowsPerPage;
export const selectSort = (state: RootState) => state.operationCodes.sort;

export const selectSortedList = createSelector(
    [selectOperationCodesList, selectWorkCenter, selectSearchRegex, selectSort],
    (list, workCenter, search, sort) => {
        return Object.values(list)
            .filter(row => !workCenter || row.WorkCenter === workCenter)
            .filter(row => search.test(row.OperationCode) || search.test(row.OperationDescription))
            .sort(operationCodeSorter(sort));
    }
)

export const selectCurrentOperationCode = (state: RootState): OperationCode | null => state.operationCodes.current.value;
export const selectLoading = (state: RootState): boolean => state.operationCodes.loading;
export const selectLoaded = (state: RootState): boolean => state.operationCodes.loaded;
export const selectCurrentLoading = (state: RootState) => state.operationCodes.current.loading;
export const selectWhereUsed = (state: RootState): string[] => state.operationCodes.current.whereUsed;

export const selectOperationCodeByCode = (state: RootState, workCenter: string, operationCode: string) => {
    if (!workCenter || !operationCode) {
        return null;
    }
    const key = operationCodeKey({WorkCenter: workCenter, OperationCode: operationCode});
    return state.operationCodes.list[key] || null;
}

export default operationCodesReducer;
