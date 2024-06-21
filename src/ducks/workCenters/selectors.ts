import {RootState} from "../../app/configureStore";
import {WorkCenter} from "chums-types";
import {createSelector} from "@reduxjs/toolkit";
import {workCenterSorter} from "./types";

export const selectWorkCentersList = (state: RootState) => state.workCenters.list.workCenters;
export const selectLoading = (state: RootState): boolean => state.workCenters.list.loading === 'pending';
export const selectWorkCentersLoaded = (state: RootState): boolean => state.workCenters.list.loaded;
export const selectSaving = (state: RootState): boolean => state.workCenters.current.actionStatus === 'saving';
export const selectCurrentWorkCenter = (state: RootState): WorkCenter | null => state.workCenters.current.workCenter;

export const selectWorkCenters = (state: RootState) => Object.values(state.workCenters.list.workCenters);
export const selectPage = (state: RootState) => state.workCenters.list.page;
export const selectRowsPerPage = (state: RootState) => state.workCenters.list.rowsPerPage;
export const selectWorkCenterSort = (state: RootState) => state.workCenters.list.sort;
export const selectFilterRatedWC = (state: RootState) => state.workCenters.list.filterRatedWorkCenters;
export const selectSortedWorkCenters = createSelector(
    [selectWorkCentersList, selectWorkCenterSort, selectFilterRatedWC],
    (list, sort, filter) => {
        return Object.values(list)
            .filter(wc => !filter || wc.isStandardWC)
            .sort(workCenterSorter(sort));
    }
)
export const selectWorkCenter = createSelector(
    [selectWorkCentersList, (_, workCenter?: string | null) => workCenter],
    (list, workCenter) => {
        if (!workCenter) {
            return null;
        }
        return list[workCenter] ?? null
    }
)
