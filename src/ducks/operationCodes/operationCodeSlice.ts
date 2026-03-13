import type {OperationCode} from "chums-types";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadOperationCode} from "@/ducks/operationCodes/actions.ts";
import {operationCodeKey} from "@/ducks/operationCodes/utils.ts";
import {dismissAlert} from "@chumsinc/alert-list";

export interface OperationCodeState {
    key: string | null;
    current: OperationCode | null;
    status: 'idle' | 'loading' | 'rejected'
    whereUsed: string[];
}

const operationCodeInitialState: OperationCodeState = {
    key: null,
    current: null,
    status: 'idle',
    whereUsed: []
};

const operationCodeSlice = createSlice({
    name: 'operationCode',
    initialState: operationCodeInitialState,
    reducers: {
        setCurrent: (state, action: PayloadAction<OperationCode | null>) => {
            state.key = action.payload ? operationCodeKey(action.payload) : null;
            state.current = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context === loadOperationCode.typePrefix) {
                    state.status = 'idle';
                }
            })
            .addCase(loadOperationCode.fulfilled, (state, action) => {
                if (state.current) {
                    const current = action.payload?.operationCodes.find(oc => operationCodeKey(oc) === state.key);
                    state.current = current ?? null;
                    if (!current) {
                        state.key = null;
                    }
                }
            })
            .addAsyncThunk(loadOperationCode, {
                pending: (state, action) => {
                    state.status = 'loading';
                    if (action.meta.arg && operationCodeKey(action.meta.arg) !== state.key) {
                        state.whereUsed = [];
                    }
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    state.current = action.payload?.operationCodes[0] ?? null;
                },
                rejected: (state) => {
                    state.status = 'rejected';
                }
            })
    },
    selectors: {
        selectCurrentOperationCode: (state) => state.current,
        selectCurrentOperationCodeKey: (state) => state.key,
        selectCurrentOperationCodeStatus: (state) => state.status,
        selectCurrentOperationCodeWhereUsed: (state) => [...state.whereUsed].sort(),
    }
});
export default operationCodeSlice;
export const {setCurrent} = operationCodeSlice.actions;
export const {
    selectCurrentOperationCodeKey,
    selectCurrentOperationCodeWhereUsed,
    selectCurrentOperationCodeStatus,
    selectCurrentOperationCode
} = operationCodeSlice.selectors;
