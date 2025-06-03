import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TemplateBillOptionHeader} from "@/ducks/types";
import {billOptionHeaderSorter} from "@/ducks/where-used/utils";
import {SortProps} from "chums-types";
import {selectWhereUsedSearch, selectWhereUsedShowInactive} from "@/ducks/where-used/index";
import {loadTemplateWhereUsed} from "@/ducks/where-used/actions";


const adapter = createEntityAdapter<TemplateBillOptionHeader, string>({
    selectId: (arg) => arg.BillNo,
    sortComparer: (a, b) => a.BillNo.localeCompare(b.BillNo)
})

const selectors = adapter.getSelectors();

interface ExtraState {
    sort: SortProps<TemplateBillOptionHeader>;
}

const extraState: ExtraState = {
    sort: {field: "BillNo", ascending: true},
}
const wuBillHeadersSlice = createSlice({
    name: 'where-used/bill-option-headers',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setSort: (state, action: PayloadAction<SortProps<TemplateBillOptionHeader>>) => {
            state.sort = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTemplateWhereUsed.fulfilled, (state, action) => {
                adapter.setAll(state, action.payload?.billOptions ?? []);
            })
    },
    selectors: {
        selectList: (state) => selectors.selectAll(state),
        selectSort: (state) => state.sort,
    },
});

export const {setSort} = wuBillHeadersSlice.actions;
export const {selectList, selectSort} = wuBillHeadersSlice.selectors;

export const selectFilteredTemplateBillOptionHeaders = createSelector(
    [selectList, selectSort, selectWhereUsedShowInactive, selectWhereUsedSearch],
    (list, sort, showInactive, search) => {
        return list
            .filter(row => showInactive || !(row.ProductType === 'D' || row.InactiveItem === 'Y'))
            .filter(row => row.BillNo.includes(search.toUpperCase())
            )
            .sort(billOptionHeaderSorter(sort))

    }
)

export default wuBillHeadersSlice;
