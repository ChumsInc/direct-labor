import {RootState} from "../../app/configureStore";
import {OperationCode} from "chums-types";
import {operationCodeDefaultSort, operationCodeKey, operationCodeSorter} from "./utils";
import {createSelector} from "@reduxjs/toolkit";

export const selectOperationCodesList = (state: RootState) => state.operationCodes.list;
export const selectWorkCenter = (state: RootState): string => state.operationCodes.workCenter;
export const selectSearch = (state: RootState): string => state.operationCodes.search;
export const selectSearchRegex = (state: RootState): RegExp => {
    try {
        return new RegExp(state.operationCodes.search, 'i');
    } catch (err) {
        return /^/;
    }
}
export const selectPage = (state: RootState): number => state.operationCodes.page;
export const selectRowsPerPage = (state: RootState) => state.operationCodes.rowsPerPage;
export const selectSort = (state: RootState) => state.operationCodes.sort;
export const selectCurrentOperationCode = (state: RootState): OperationCode | null => state.operationCodes.current.value;
export const selectLoading = (state: RootState): boolean => state.operationCodes.loading;
export const selectLoaded = (state: RootState): boolean => state.operationCodes.loaded;
export const selectCurrentLoading = (state: RootState) => state.operationCodes.current.loading;
export const selectWhereUsed = (state: RootState): string[] => state.operationCodes.current.whereUsed;


export const selectOperationCodeList = createSelector(
    [selectOperationCodesList],
    (list) => {
        return Object.values(list).sort(operationCodeSorter(operationCodeDefaultSort));
    }
)
export const selectFilteredOpCodeList = createSelector(
    [selectOperationCodesList, selectWorkCenter, selectSearchRegex, selectSort],
    (list, workCenter, search, sort) => {
        return Object.values(list)
            .filter(row => !workCenter || row.WorkCenter === workCenter)
            .filter(row => search.test(row.OperationCode) || search.test(row.OperationDescription))
            .sort(operationCodeSorter(sort));
    }
)


export const selectOperationCodeByCode = createSelector(
    [selectOperationCodesList, (_, workCenter, operationCode) => ({workCenter, operationCode})],
    (list, options) => {
        if (!options.workCenter || !options.operationCode) {
            return null;
        }
        const key = operationCodeKey({WorkCenter: options.workCenter, OperationCode: options.operationCode});
        return list[key] ?? null;

    }
)
