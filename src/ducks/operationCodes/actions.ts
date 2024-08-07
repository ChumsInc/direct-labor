import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {OperationCode, OperationCodeKey, SortProps} from "chums-types";
import {OperationCodeResponse} from "./types";
import {fetchOperationCode, fetchOperationCodes} from "./api";
import {RootState} from "../../app/configureStore";
import {selectCurrentLoading, selectLoading} from "./selectors";

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

export const loadOperationCode = createAsyncThunk<OperationCodeResponse | null, OperationCodeKey | null>(
    'operationCodes/selected/load',
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
