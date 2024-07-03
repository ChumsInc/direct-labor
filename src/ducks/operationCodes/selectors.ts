import {RootState} from "../../app/configureStore";
import {operationCodeDefaultSort, operationCodeKey, operationCodeSorter} from "./utils";
import {createSelector} from "@reduxjs/toolkit";

export const selectOperationCodesList = (state: RootState) => state.operationCodes.list.values;
export const selectWorkCenter = (state: RootState) => state.operationCodes.list.filters.workCenter;
export const selectSearch = (state: RootState) => state.operationCodes.list.filters.search;
export const selectSort = (state: RootState) => state.operationCodes.list.sort
export const selectCurrentOperationCode = (state: RootState) => state.operationCodes.current.value;
export const selectLoading = (state: RootState) => state.operationCodes.list.status === 'loading';
export const selectLoaded = (state: RootState) => state.operationCodes.list.loaded;
export const selectCurrentLoading = (state: RootState) => state.operationCodes.current.status === 'loading';
export const selectWhereUsed = (state: RootState) => state.operationCodes.current.whereUsed;
const _selectWCFilterOption = (state: RootState, workCenter: string, operationCode: string): string => operationCodeKey({
    WorkCenter: workCenter,
    OperationCode: operationCode
})


export const selectSearchRegex = createSelector(
    [selectSearch],
    (search) => {
        try {
            return new RegExp(search, 'i');
        } catch (err) {
            return /^/;
        }
    })

export const selectOperationCodeList = createSelector(
    [selectOperationCodesList],
    (list) => {
        return Object.values(list).sort(operationCodeSorter(operationCodeDefaultSort));
    }
)
export const selectFilteredOpCodeList = createSelector(
    [selectOperationCodesList, selectWorkCenter, selectSearchRegex, selectSort],
    (list, workCenter, search, sort) => {
        return list
            .filter(row => !workCenter || row.WorkCenter === workCenter)
            .filter(row => search.test(row.OperationCode) || search.test(row.OperationDescription))
            .sort(operationCodeSorter(sort));
    }
)


export const selectOperationCodeByCode = createSelector(
    [selectOperationCodesList, _selectWCFilterOption],
    (list, key) => {
        const [code] = list.filter(row => operationCodeKey(row) === key);
        return code ?? null;

    }
)
