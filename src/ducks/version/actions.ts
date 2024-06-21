import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchVersion} from "./api";
import {RootState} from "../../app/configureStore";
import {selectVersionLoading} from "./selectors";

export const loadVersion = createAsyncThunk<string|null>(
    'version/load',
    async () => {
        return await fetchVersion();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectVersionLoading(state);
        }
    }
)
