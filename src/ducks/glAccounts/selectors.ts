import type {RootState} from "@/app/configureStore";
import type {GLAccount} from "chums-types";
import {createSelector} from "@reduxjs/toolkit";

export const accountListSelector = (keys: string[]) => (state: RootState): GLAccount[] => {
    const {accounts} = state.glAccounts;
    return Object.keys(accounts).filter(key => keys.includes(key)).map(key => accounts[key]);
}

export const selectGLAccountList = (state:RootState) => state.glAccounts.accounts;

export const selectGLByAccountKey = createSelector(
    [selectGLAccountList, (_, key:string) => key],
    (list, key) => {
        return list[key] ?? null;
    }
)
