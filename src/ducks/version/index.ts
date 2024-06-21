import {createReducer} from "@reduxjs/toolkit";
import {loadVersion} from "./actions";

export interface VersionState {
    version: string | null;
    loading: boolean;
}

export const initialState: VersionState = {
    version: null,
    loading: false,
}

const versionReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadVersion.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadVersion.fulfilled, (state, action) => {
            state.loading = false;
            state.version = action.payload;
        })
        .addCase(loadVersion.rejected, (state) => {
            state.loading = false;
        })
});

export default versionReducer;

