import {selectLoading,} from "./index";
import {WorkCenter, WorkCenterList} from "../types";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchWorkCenters, postWorkCenterRate} from "../../api/work-center";

import {SortProps} from "chums-components";
import {RootState} from "../../app/configureStore";

export const setCurrentWorkCenter = createAction<WorkCenter | null>('workCenters/setCurrent');
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
