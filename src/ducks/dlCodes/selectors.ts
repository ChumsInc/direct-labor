import {dlCodeSorter} from "./utils";
import {DLCodeStep} from "chums-types";
import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";


export const selectDLCodesStatus = (state: RootState) => state.dlCodes.list.status;
export const selectLoaded = (state: RootState): boolean => state.dlCodes.list.loaded;
export const selectCurrentHeader = (state: RootState) => state.dlCodes.current.header;
export const selectCurrentSteps = (state: RootState): DLCodeStep[] => state.dlCodes.current.steps;
export const selectCurrentDLCodeStatus = (state: RootState) => state.dlCodes.current.status;
export const selectCurrentChanged = (state: RootState): boolean => state.dlCodes.current.changed;
export const selectFilter = (state: RootState): string => state.dlCodes.list.filters.search;
export const selectWorkCenterFilter = (state: RootState): string => state.dlCodes.list.filters.workCenter;
export const selectShowInactive = (state: RootState): boolean => state.dlCodes.list.filters.showInactive;
export const selectSort = (state: RootState) => state.dlCodes.list.sort;
export const selectDLCodesList = (state: RootState) => state.dlCodes.list.values;

export const selectSortedList = createSelector(
    [selectDLCodesList, selectFilter, selectWorkCenterFilter, selectShowInactive, selectSort],
    (list, search, wcFilter, showInactive, sort) => {
        let re = /^/;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }

        return list
            .filter(dl => showInactive || dl.active)
            .filter(dl => !wcFilter || dl.workCenter === wcFilter)
            .filter(dl => re.test(dl.dlCode) || re.test(dl.description) || re.test(dl.operationCode))
            .sort(dlCodeSorter(sort));
    }
)
