import {WorkCenterList} from "../types";
import {createReducer} from "@reduxjs/toolkit";
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
import {WorkCenter} from "chums-types";

export const defaultSort: SortProps<WorkCenter> = {
    field: "WorkCenterCode",
    ascending: true,
}

export interface WorkCentersState {
    list: {
        workCenters: WorkCenterList,
        loading: 'idle'|'pending';
        loaded: boolean;
        page: number;
        rowsPerPage: number;
        filterRatedWorkCenters: boolean;
        sort: SortProps<WorkCenter>;
    }
    current: {
        code: string|null;
        workCenter: WorkCenter|null;
        actionStatus: 'idle'|'loading'|'saving';
    }
}


export const initialWorkCenterState: WorkCentersState = {
    list: {
        workCenters: {},
        loading: 'idle',
        loaded: false,
        page: 0,
        rowsPerPage: 25,
        filterRatedWorkCenters: true,
        sort: {...defaultSort},
    },
    current: {
        code: null,
        workCenter: null,
        actionStatus: 'idle'
    }
}

const workCentersReducer = createReducer(initialWorkCenterState, (builder) => {
    builder
        .addCase(setCurrentWorkCenter, (state, action) => {
            state.current.code = action.payload;
            state.current.workCenter = state.list.workCenters[action.payload] ?? null;
        })
        .addCase(setWorkCenterRate, (state, action) => {
            if (state.current.workCenter) {
                state.current.workCenter.AverageHourlyRate = action.payload;
            }
        })
        .addCase(loadWorkCenters.pending, (state) => {
            state.list.loading = 'pending';
        })
        .addCase(loadWorkCenters.fulfilled, (state, action) => {
            state.list.loading = 'idle';
            state.list.loaded = true;
            state.list.workCenters = {...action.payload};
            if (state.current.code) {
                state.current.workCenter = action.payload[state.current.code] ?? null
            }
        })
        .addCase(loadWorkCenters.rejected, (state) => {
            state.list.loading = 'idle';
        })
        .addCase(saveWorkCenter.pending, (state) => {
            state.current.actionStatus = 'saving'
        })
        .addCase(saveWorkCenter.fulfilled, (state, action) => {
            state.current.actionStatus = 'idle';
            if (!action.payload && state.current.code) {
                delete state.list.workCenters[state.current.code];
            }
            state.current.workCenter = action.payload;
            if (action.payload) {
                state.list.workCenters[action.payload.WorkCenterCode] = action.payload;
            }
        })
        .addCase(saveWorkCenter.rejected, (state) => {
            state.current.actionStatus = 'idle';
        })
        .addCase(setPage, (state, action) => {
            state.list.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.list.rowsPerPage = action.payload;
            state.list.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.list.sort = action.payload;
            state.list.page = 0;
        })
        .addCase(toggleFilterRatedWC, (state, action) => {
            state.list.filterRatedWorkCenters = action.payload ?? !state.list.filterRatedWorkCenters;
        });
});


export default workCentersReducer;
