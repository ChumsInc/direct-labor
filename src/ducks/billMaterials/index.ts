import {
    billHeaderKey,
    billHeaderSorter,
    billOptionHeaderKey,
    billOptionHeaderSorter,
    defaultBillOptionSort,
    defaultBillSort
} from "./utils";
import {RootState} from "../../app/configureStore";
import {setCurrentRouting} from "../routing/actions";

import {BillHeader, BillOptionHeader} from "chums-types";
import {SortProps} from "chums-types";
import {createReducer} from "@reduxjs/toolkit";
import {BillHeaderList, BillOptionHeaderList} from "../types";

export interface BOMState {
    headerList: BillHeaderList;
    headerOptionList: BillOptionHeaderList;
}

export const initialState: BOMState = {
    headerList: {},
    headerOptionList: {},
}


export const billHeaderSelector = (state: RootState, sort: SortProps<BillHeader> = defaultBillSort): BillHeader[] => Object.values(state.billMaterials.headerList).sort(billHeaderSorter(sort));
export const billOptionHeaderSelector = (state: RootState, sort: SortProps<BillOptionHeader> = defaultBillOptionSort): BillOptionHeader[] => Object.values(state.billMaterials.headerOptionList).sort(billOptionHeaderSorter(sort));

export const billMaterialsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setCurrentRouting.pending, (state) => {
            state.headerList = {};
            state.headerOptionList = {};
        })
        .addCase(setCurrentRouting.fulfilled, (state, action) => {
            action.payload?.whereUsed?.forEach(row => {
                state.headerList[billHeaderKey(row)] = row;
            })
            action.payload?.whereUsedOption?.forEach(row => {
                state.headerOptionList[billOptionHeaderKey(row)] = row;
            })
        })
})

export default billMaterialsReducer;
