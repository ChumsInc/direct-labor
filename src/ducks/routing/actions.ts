import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RoutingHeader, SortProps} from "chums-types";
import {fetchRouting, fetchRoutings} from "./api";
import {RootState} from "../../app/configureStore";
import {RoutingResponse} from "../types";
import {selectCurrentLoading, selectLoading} from "./selectors";

export const setSearch = createAction<string>('routing/filter/setSearch');
export const toggleShowInactive = createAction<boolean | undefined>('routing/filter/toggleShowInactive');
export const setPage = createAction<number>('routing/setPage');
export const setRowsPerPage = createAction<number>('routing/setRowsPerPage');
export const setSort = createAction<SortProps<RoutingHeader>>('routing/setSort');

export const loadRoutings = createAsyncThunk<RoutingHeader[]>(
    'routing/load',
    async () => {
        return await fetchRoutings()
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const setCurrentRouting = createAsyncThunk<RoutingResponse | null, string>(
    'routing/selected/load',
    async (arg) => {
        return await fetchRouting(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentLoading(state) === 'idle';
        }
    }
)
