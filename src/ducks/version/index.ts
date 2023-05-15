import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchVersion} from "../../api/version";
import {RootState} from "../../app/configureStore";

export interface VersionState {
    version: string|null;
    loading: boolean;
}

export const initialState:VersionState = {
    version: null,
    loading: false,
}

export const selectVersion = (state:RootState) => state.version.version;

export const loadVersion = createAsyncThunk<string|null>(
    'version/load',
    async () => {
        return await fetchVersion();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !state.version.loading;
        }
    }
)
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

