import {RootState} from "../../app/configureStore";
import {BillHeader, BillOptionHeader, SortProps} from "chums-types";
import {billHeaderSorter, billOptionHeaderSorter, defaultBillOptionSort, defaultBillSort} from "./utils";
import {createSelector} from "@reduxjs/toolkit";


export const selectBillHeaderList = (state: RootState) => state.billMaterials.headerList;
export const selectBillOptionHeaderList = (state: RootState) => state.billMaterials.headerOptionList;

export const billHeaderSelector = createSelector(
    [selectBillHeaderList, (_, sort:SortProps<BillHeader> = defaultBillSort) => sort],
    (list, sort) => {
        return Object.values(list).sort(billHeaderSorter(sort));
    }
)

export const billOptionHeaderSelector = createSelector(
    [selectBillOptionHeaderList, (_, sort:SortProps<BillOptionHeader> = defaultBillOptionSort) => sort],
    (list, sort) => {
        return Object.values(list).sort(billOptionHeaderSorter(sort));
    }
)
