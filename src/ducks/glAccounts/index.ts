import {loadOperationCode, loadOperationCodes} from "../operationCodes";
import {GLAccount, GLAccountList} from "../types";
import {RootState} from "../../app/configureStore";
import {createReducer} from "@reduxjs/toolkit";


export interface GlAccountsState {
    accounts: GLAccountList
}

export const defaultState: GlAccountsState = {
    accounts: {}
};

export const accountListSelector = (keys: string[]) => (state: RootState): GLAccount[] => {
    const {accounts} = state.glAccounts;
    return Object.keys(accounts).filter(key => keys.includes(key)).map(key => accounts[key]);
}

export const selectGLByAccountKey = (state: RootState, accountKey: string): GLAccount | null => state.glAccounts.accounts[accountKey] ?? null;

export const glAccountReducer = createReducer(defaultState, (builder) => {
    builder
        .addCase(loadOperationCodes.fulfilled, (state, action) => {
            if (action.payload) {
                state.accounts = {};
                action.payload.accounts.forEach(row => {
                    state.accounts[row.AccountKey] = row;
                })
            }
        })
        .addCase(loadOperationCode.fulfilled, (state, action) => {
            if (action.payload) {
                action.payload.accounts.forEach(row => {
                    state.accounts[row.AccountKey] = row;
                })
            }
        })
})
export default glAccountReducer;
