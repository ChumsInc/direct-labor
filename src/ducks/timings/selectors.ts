import {dlStepTimingSorter} from "./utils";
import type {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";

export const selectTimingList = (state: RootState) => state.timings.list;
export const selectCurrentTimingStatus = (state: RootState) => state.timings.current.actionStatus;
export const selectCurrentTiming = (state: RootState) => state.timings.current.stepTiming;
export const selectCurrentTimingActionStatus = (state:RootState) => state.timings.current.actionStatus;
export const selectCurrentLoading = (state: RootState): boolean => state.timings.current.actionStatus === 'loading';
export const selectCurrentSaving = (state: RootState): boolean => state.timings.current.actionStatus === 'saving';
export const selectTimingsIsEditing = (state: RootState): boolean => state.timings.edit;
export const selectTimingsSort = (state: RootState) => state.timings.sort;
export const selectSortedTimingsList = createSelector(
    [selectTimingList, selectTimingsSort],
    (list, sort) => {
        return [...list].sort(dlStepTimingSorter(sort));
    }
)

