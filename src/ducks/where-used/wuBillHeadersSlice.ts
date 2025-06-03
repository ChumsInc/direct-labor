import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TemplateBillHeader} from "@/ducks/types";
import {billHeaderSorter, templateBillHeaderKey} from "@/ducks/where-used/utils";
import {SortProps} from "chums-types";
import {selectWhereUsedSearch, selectWhereUsedShowInactive} from "@/ducks/where-used/index";
import {loadTemplateWhereUsed} from "@/ducks/where-used/actions";


const adapter = createEntityAdapter<TemplateBillHeader, string>({
    selectId: (arg) => templateBillHeaderKey(arg),
    sortComparer: (a, b) => templateBillHeaderKey(a).localeCompare(templateBillHeaderKey(b))
})

const selectors = adapter.getSelectors();

interface ExtraState {
    sort: SortProps<TemplateBillHeader>;
}

const extraState: ExtraState = {
    sort: {field: "BillNo", ascending: true},
}
const wuBillHeadersSlice = createSlice({
    name: 'where-used/bill-headers',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setSort: (state, action:PayloadAction<SortProps<TemplateBillHeader>>) => {
            state.sort = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTemplateWhereUsed.fulfilled, (state, action) => {
                adapter.setAll(state, action.payload?.billHeaders ?? []);
            })
    },
    selectors: {
        selectBillHeadersList: (state) => selectors.selectAll(state),
        selectBillHeadersSort: (state) => state.sort,
    },
});

export const {setSort} = wuBillHeadersSlice.actions;
export const {selectBillHeadersList, selectBillHeadersSort} = wuBillHeadersSlice.selectors;

export const selectFilteredTemplateBillHeaders = createSelector(
    [selectBillHeadersList, selectBillHeadersSort, selectWhereUsedShowInactive, selectWhereUsedSearch],
    (list, sort, showInactive, search) => {
        return list
            .filter(row => showInactive || !(row.ProductType === 'D' || row.InactiveItem === 'Y'))
            .filter(row => row.BillNo.includes(search.toUpperCase())
                || (row.BillDesc1 ?? '').toLowerCase().includes(search.toLowerCase())
                || (row.BillDesc2 ?? '').toLowerCase().includes(search.toLowerCase())
            )
            .sort(billHeaderSorter(sort))

    }
)

export default wuBillHeadersSlice;
