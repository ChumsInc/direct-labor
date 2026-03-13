import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {OperationCode, SortProps} from "chums-types";
import {operationCodeDefaultSort, operationCodeKey, operationCodeSorter} from "@/ducks/operationCodes/utils.ts";
import {loadOperationCode, loadOperationCodes} from "@/ducks/operationCodes/actions.ts";

const adapter = createEntityAdapter<OperationCode, string>({
    selectId: (arg) => operationCodeKey(arg),
    sortComparer: (a, b) => operationCodeKey(a).localeCompare(operationCodeKey(b))
})

const selectors = adapter.getSelectors();

export interface OperationCodeListState {
    status: 'idle' | 'loading' | 'rejected',
    filters: {
        workCenter: string,
        search: string,
    },
    sort: SortProps<OperationCode>
}

const extraState: OperationCodeListState = {
    status: 'idle',
    filters: {
        workCenter: '',
        search: '',
    },
    sort: {...operationCodeDefaultSort},
}

const operationCodeListSlice = createSlice({
    name: 'operationCodesList',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.filters.search = action.payload;
        },
        setWorkCenter: (state, action: PayloadAction<string>) => {
            state.filters.workCenter = action.payload;
        },
        setSort: (state, action: PayloadAction<SortProps<OperationCode>>) => {
            state.sort = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadOperationCode.fulfilled, (state, action) => {
                if (action.payload && action.payload.operationCodes.length === 1) {
                    adapter.upsertOne(state, action.payload.operationCodes[0]);
                }
            })
            .addAsyncThunk(loadOperationCodes, {
                'pending': (state) => {
                    state.status = 'loading';
                },
                'fulfilled': (state, action) => {
                    state.status = 'idle';
                    adapter.setAll(state, action.payload?.operationCodes ?? []);
                },
                'rejected': (state) => {
                    state.status = 'rejected';
                }
            })
    },
    selectors: {
        selectOCList: (state) => selectors.selectAll(state),
        selectOCListWorkCenter: (state) => state.filters.workCenter,
        selectOCListSearch: (state) => state.filters.search,
        selectOCListSort: (state) => state.sort,
        selectOCListStatus: (state) => state.status,
    }
})

export default operationCodeListSlice;
export const {setSearch, setWorkCenter, setSort} = operationCodeListSlice.actions;
export const {
    selectOCList,
    selectOCListWorkCenter,
    selectOCListSearch,
    selectOCListStatus,
    selectOCListSort
} = operationCodeListSlice.selectors;

export const selectFilteredOpCodeList = createSelector(
    [selectOCList, selectOCListWorkCenter, selectOCListSearch, selectOCListSort],
    (list, workCenter, search, sort) => {
        const searchRegex = getOCSearchRegex(search);
        return list
            .filter(row => !workCenter || row.WorkCenter === workCenter)
            .filter(row => searchRegex.test(row.OperationCode) || searchRegex.test(row.OperationDescription))
            .sort(operationCodeSorter(sort));
    }
)


function getOCSearchRegex(search: string): RegExp {
    try {
        return new RegExp(search, 'i');
    } catch (_err: unknown) {
        return /^/;
    }
}
