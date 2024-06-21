import {selectLoading,} from "./selectors";
import {WorkCenterList} from "../types";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchWorkCenters, postWorkCenterRate} from "./api";
import {SortProps} from "chums-components";
import {RootState} from "../../app/configureStore";
import {WorkCenter} from "chums-types";

export const setCurrentWorkCenter = createAction<string>('workCenters/setCurrent');
export const setWorkCenterRate = createAction<number>('workCenters/setCurrentRate');
export const setPage = createAction<number>('workCenters/setPage');
export const setRowsPerPage = createAction<number>('workCenters/setRowsPerPage');
export const toggleFilterRatedWC = createAction<boolean | undefined>('workCenters/toggleFilterRatedWC');
export const setSort = createAction<SortProps<WorkCenter>>('workCenters/setSort');

export const loadWorkCenters = createAsyncThunk<WorkCenterList>(
    'workCenters/load',
    async () => {
        return await fetchWorkCenters();
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const saveWorkCenter = createAsyncThunk<WorkCenter | null, WorkCenter>(
    'workCenters/save',
    async (arg) => {
        return await postWorkCenterRate(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)
