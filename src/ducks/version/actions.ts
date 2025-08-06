import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchVersion} from "./api";
import type {RootState} from "@/app/configureStore.ts";
import {selectVersionLoading} from "./selectors";

export const loadVersion = createAsyncThunk<string|null>(
    'version/load',
    async () => {
        return await fetchVersion();
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return !selectVersionLoading(state);
        }
    }
)
