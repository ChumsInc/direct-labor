import {workCenterSorter, WorkCenterSorterProps} from "./types";
import {WorkCenter, WorkCenterList} from "../types";
import {createReducer, createSelector} from "@reduxjs/toolkit";
import {
    loadWorkCenters,
    saveWorkCenter,
    setCurrentWorkCenter,
    setPage,
    setRowsPerPage,
    setSort,
    setWorkCenterRate,
    toggleFilterRatedWC
} from "./actions";
import {SortProps} from "chums-components";
import {RootState} from "../../app/configureStore";

export const defaultSort: SortProps<WorkCenter> = {
    field: "WorkCenterCode",
    ascending: true,
}

export interface WorkCentersState {
    list: WorkCenterList,
    selected: WorkCenter | null;
    loading: boolean;
    loaded: boolean;
    saving: boolean;
    page: number;
    rowsPerPage: number;
    filterRatedWorkCenters: boolean;
    sort: SortProps<WorkCenter>;
}


export const initialWorkCenterState: WorkCentersState = {
    list: {},
    selected: null,
    loading: false,
    loaded: false,
    saving: false,
    page: 0,
    rowsPerPage: 25,
    filterRatedWorkCenters: true,
    sort: {...defaultSort},
}

const workCentersReducer = createReducer(initialWorkCenterState, (builder) => {
    builder
        .addCase(setCurrentWorkCenter, (state, action) => {
            state.selected = action.payload;
        })
        .addCase(setWorkCenterRate, (state, action) => {
            if (state.selected) {
                state.selected.AverageHourlyRate = action.payload;
            }
        })
        .addCase(loadWorkCenters.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadWorkCenters.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = {...action.payload};
            if (state.selected) {
                state.selected = action.payload[state.selected.WorkCenterCode] ?? null;
            }
        })
        .addCase(loadWorkCenters.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveWorkCenter.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveWorkCenter.fulfilled, (state, action) => {
            state.saving = false;
            if (!action.payload && state.selected) {
                delete state.list[state.selected.WorkCenterCode];
            }
            state.selected = action.payload;
            if (action.payload) {
                state.list[action.payload.WorkCenterCode] = action.payload;
            }
        })
        .addCase(saveWorkCenter.rejected, (state) => {
            state.saving = false;
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
        .addCase(toggleFilterRatedWC, (state, action) => {
            state.filterRatedWorkCenters = action.payload ?? !state.filterRatedWorkCenters;
        });
});


export const listSelector = (sort: WorkCenterSorterProps) => (state: RootState): WorkCenter[] =>
    Object.values(state.workCenters.list).sort(workCenterSorter(sort));
export const stdListSelector = (sort: WorkCenterSorterProps) => (state: RootState): WorkCenter[] =>
    Object.values(state.workCenters.list)
        .filter(wc => wc.isStandardWC)
        .sort(workCenterSorter(sort));

export const nonStdListSelector = (sort: WorkCenterSorterProps) => (state: RootState): WorkCenter[] => Object.values(state.workCenters.list)
    .filter(wc => !wc.isStandardWC)
    .sort(workCenterSorter(sort));

export const selectLoading = (state: RootState): boolean => state.workCenters.loading || state.workCenters.saving;
export const selectLoaded = (state: RootState): boolean => state.workCenters.loaded;
export const selectSaving = (state: RootState): boolean => state.workCenters.saving;
export const selectCurrentWorkCenter = (state: RootState): WorkCenter | null => state.workCenters.selected;
export const selectWorkCenter = (state: RootState, workCenter?:string) => {
    if (!workCenter) {
        return null;
    }
    return state.workCenters.list[workCenter] || null;
}

export const selectWorkCenters = (state:RootState) => Object.values(state.workCenters.list);
export const selectPage = (state:RootState) => state.workCenters.page;
export const selectRowsPerPage = (state:RootState) => state.workCenters.rowsPerPage;
export const selectSort = (state:RootState) => state.workCenters.sort;
export const selectFilterRatedWC = (state:RootState) => state.workCenters.filterRatedWorkCenters;
export const selectSortedWorkCenters = createSelector(
    [selectWorkCenters, selectSort, selectFilterRatedWC],
    (list, sort, filter) => {
        return list.filter(wc => !filter || wc.isStandardWC)
            .sort(workCenterSorter(sort));
    }
)

export default workCentersReducer;
