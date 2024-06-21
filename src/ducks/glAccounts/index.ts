import {loadOperationCode, loadOperationCodes} from "../operationCodes/actions";
import {GLAccountList} from "../types";
import {RootState} from "../../app/configureStore";
import {createReducer} from "@reduxjs/toolkit";
import {GLAccount} from "chums-types";


export interface GlAccountsState {
    accounts: GLAccountList
}

export const defaultState: GlAccountsState = {
    accounts: {}
};


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
