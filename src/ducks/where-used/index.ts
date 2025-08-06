import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadTemplateWhereUsed} from "@/ducks/where-used/actions";

interface WhereUsedState {
    search: string;
    showInactive: boolean;
    status: 'idle' | 'loading' | 'rejected';
}

const initialState: WhereUsedState = {
    search: '',
    showInactive: false,
    status: 'idle',
}

const whereUsedSlice = createSlice({
    name: 'where-used',
    initialState: initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        setShowInactive: (state, action: PayloadAction<boolean>) => {
            state.showInactive = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTemplateWhereUsed.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadTemplateWhereUsed.fulfilled, (state) => {
                state.status = 'idle';
            })
            .addCase(loadTemplateWhereUsed.rejected, (state) => {
                state.status = 'rejected';
            })
    },
    selectors: {
        selectWhereUsedSearch: (state) => state.search,
        selectWhereUsedShowInactive: (state) => state.showInactive,
        selectWhereUsedStatus: (state) => state.status,
    }
});

export const {setSearch, setShowInactive,} = whereUsedSlice.actions;
export const {selectWhereUsedStatus, selectWhereUsedShowInactive, selectWhereUsedSearch} = whereUsedSlice.selectors;


export default whereUsedSlice;
