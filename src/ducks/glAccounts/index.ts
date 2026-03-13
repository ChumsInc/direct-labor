import {loadOperationCode, loadOperationCodes} from "../operationCodes/actions";
import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import type {GLAccount} from "chums-types";

const adapter = createEntityAdapter<GLAccount, string>({
    selectId: (arg) => arg.AccountKey,
    sortComparer: (a, b) => a.Account.localeCompare(b.Account)
})

const selectors = adapter.getSelectors();

const glAccountsSlice = createSlice({
    name: 'glAccounts',
    initialState: adapter.getInitialState(),
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadOperationCodes.fulfilled, (state, action) => {
                if (action.payload) {
                    adapter.setAll(state, action.payload.accounts);
                }
            })
            .addCase(loadOperationCode.fulfilled, (state, action) => {
                if (action.payload) {
                    adapter.setMany(state, action.payload.accounts)
                }
            })
    },
    selectors: {
        selectAllGLAccounts: (state) => selectors.selectAll(state),
        selectGLAccountById: (state, key: string) => selectors.selectById(state, key),
    }
})
export default glAccountsSlice;
export const {selectAllGLAccounts, selectGLAccountById} = glAccountsSlice.selectors;
