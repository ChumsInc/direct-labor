import {dlCodeSorter} from "./types";
import {DLCode, DLCodeStep} from "../types";
import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";


export const listLengthSelector = (state: RootState): number => Object.keys(state.dlCodes.list).length;
export const selectDLCodeByID = (state: RootState, id:number): DLCode | null => state.dlCodes.list[id] || null;
export const selectLoading = (state: RootState): boolean => state.dlCodes.loading;
export const selectLoaded = (state: RootState): boolean => state.dlCodes.loaded;
export const selectCurrentHeader = (state: RootState) => state.dlCodes.current.header;
export const selectCurrentSteps = (state: RootState): DLCodeStep[] => state.dlCodes.current.steps;
export const selectCurrentLoading = (state: RootState): boolean => state.dlCodes.current.loading;
export const selectCurrentSaving = (state: RootState): boolean => state.dlCodes.current.saving;
export const selectCurrentChanged = (state: RootState): boolean => state.dlCodes.current.changed;
export const selectFilter = (state: RootState): string => state.dlCodes.search;
export const selectWorkCenterFilter = (state: RootState): string => state.dlCodes.workCenter;
export const selectShowInactive = (state: RootState): boolean => state.dlCodes.showInactive;
export const selectPage = (state: RootState) => state.dlCodes.page;
export const selectRowsPerPage = (state: RootState) => state.dlCodes.rowsPerPage;
export const selectSort = (state: RootState) => state.dlCodes.sort;
export const selectList = (state: RootState) => Object.values(state.dlCodes.list) as DLCode[];
export const selectSortedList = createSelector(
    [selectList, selectFilter, selectWorkCenterFilter, selectShowInactive, selectSort],
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
