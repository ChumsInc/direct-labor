import {OperationCodeAction} from "../operationCodes/types";
import {loadOCSucceeded} from "../operationCodes";
import {RootState} from "../index";

export interface GLAccount {
    AccountKey: string,
    Account: string,
    AccountDesc: string,
}

export interface GLAccountList {
    [key: string]: GLAccount,
}

export interface GlAccountsState {
    accounts: GLAccountList
}

export const defaultState = {accounts: {}};

export const accountListSelector = (keys: string[]) => (state: RootState): GLAccount[] => {
    const {accounts} = state.glAccounts;
    return Object.keys(accounts).filter(key => keys.includes(key)).map(key => accounts[key]);
}

export const glAccountSelector = (accountKey: string) => (state: RootState): GLAccount | null => state.glAccounts.accounts[accountKey] || null;

const glAccountReducer = (state: GlAccountsState = defaultState, action: OperationCodeAction): GlAccountsState => {
    const {type, payload} = action;
    switch (type) {
    case loadOCSucceeded:
        if (payload?.accounts) {
            payload.accounts.forEach(acct => state.accounts[acct.AccountKey] = acct);
            return state;
        }
        return state;
    default:
        return state;
    }
}

export default glAccountReducer;
