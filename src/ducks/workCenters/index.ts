import type {WorkCenterList} from "../types";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadActivityCodeChanges,
    loadTemplateChanges,
    loadWorkCenters,
    saveWorkCenter,
    setCurrentWorkCenter,
    setSort,
    setWCSearch,
    setWorkCenterRate,
    toggleFilterRatedWC
} from "./actions";
import type {SortProps, WorkCenter} from "chums-types";

export const defaultSort: SortProps<WorkCenter> = {
    field: "workCenter",
    ascending: true,
}

export interface WorkCentersState {
    list: {
        workCenters: WorkCenterList,
        loading: 'idle' | 'pending';
        loaded: boolean;
        filterRatedWorkCenters: boolean;
        search: string;
        sort: SortProps<WorkCenter>;
    }
    current: {
        code: string | null;
        workCenter: WorkCenter | null;
        actionStatus: 'idle' | 'loading' | 'saving';
        templateChanges: number;
        activityCodeChanges: number;
    }
}


export const initialWorkCenterState: WorkCentersState = {
    list: {
        workCenters: {},
        loading: 'idle',
        loaded: false,
        filterRatedWorkCenters: true,
        search: '',
        sort: {...defaultSort},
    },
    current: {
        code: null,
        workCenter: null,
        actionStatus: 'idle',
        templateChanges: 0,
        activityCodeChanges: 0,
    }
}

const workCentersReducer = createReducer(initialWorkCenterState, (builder) => {
    builder
        .addCase(setCurrentWorkCenter, (state, action) => {
            state.current.code = action.payload;
            state.current.workCenter = state.list.workCenters[action.payload] ?? null;
            state.current.templateChanges = 0;
            state.current.activityCodeChanges = 0;
        })
        .addCase(setWorkCenterRate, (state, action) => {
            if (state.current.workCenter) {
                state.current.workCenter.averageHourlyRate = action.payload;
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
                state.list.workCenters[action.payload.workCenter] = action.payload;
            }
        })
        .addCase(saveWorkCenter.rejected, (state) => {
            state.current.actionStatus = 'idle';
        })
        .addCase(setSort, (state, action) => {
            state.list.sort = action.payload;
        })
        .addCase(toggleFilterRatedWC, (state, action) => {
            state.list.filterRatedWorkCenters = action.payload ?? !state.list.filterRatedWorkCenters;
        })
        .addCase(setWCSearch, (state, action) => {
            state.list.search = action.payload;
        })
        .addCase(loadTemplateChanges.fulfilled, (state, action) => {
            state.current.templateChanges = action.payload;
        })
        .addCase(loadActivityCodeChanges.fulfilled, (state, action) => {
            state.current.activityCodeChanges = action.payload;
        })
    ;
});


export default workCentersReducer;
