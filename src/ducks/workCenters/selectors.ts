import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {workCenterSorter} from "./utils";
import {defaultSort} from "./index";

export const selectWorkCentersList = (state: RootState) => state.workCenters.list.workCenters;
export const selectLoading = (state: RootState) => state.workCenters.list.loading === 'pending';
export const selectWorkCentersLoaded = (state: RootState) => state.workCenters.list.loaded;
export const selectSaving = (state: RootState) => state.workCenters.current.actionStatus === 'saving';
export const selectCurrentWorkCenter = (state: RootState) => state.workCenters.current.workCenter;
export const selectWorkCenterSearch = (state: RootState) => state.workCenters.list.search;

export const selectWorkCenterSort = (state: RootState) => state.workCenters.list.sort;
export const selectFilterRatedWC = (state: RootState) => state.workCenters.list.filterRatedWorkCenters;

export const selectWorkCenters = createSelector(
    [selectWorkCentersList,],
    (list) => {
        return Object.values(list)
            .sort(workCenterSorter({...defaultSort}));
    }
)

export const selectRatedWorkCenterCodes = createSelector(
    [selectWorkCentersList],
    (list) => {
        return Object.values(list).filter(wc => wc.isStandardWC).map(wc => wc.workCenter);
    }
)

export const selectSortedWorkCenters = createSelector(
    [selectWorkCentersList, selectWorkCenterSort, selectFilterRatedWC, selectWorkCenterSearch],
    (list, sort, filter, search) => {
        return Object.values(list)
            .filter(wc => !search || wc.workCenter.toUpperCase().includes(search.toUpperCase()))
            .filter(wc => !filter || wc.isStandardWC)
            .sort(workCenterSorter(sort));
    }
)
