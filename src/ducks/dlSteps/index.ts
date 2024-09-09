import {DLSteps} from "../types";
import {DLBasicStep, DLCode, DLStep, SortProps} from "chums-types";
import {createReducer} from "@reduxjs/toolkit";
import {LocalStore} from "chums-components";
import {filterInactiveStepsKey} from "../../utils/preferences";
import {
    changeDLStep,
    loadDLStep,
    loadDLSteps,
    loadDLStepWhereUsed,
    saveDLStep,
    setCurrentStep,
    setStepFilter,
    setStepSort,
    setStepWCFilter,
    toggleShowInactive
} from "./actions";
import {dismissAlert} from "../alerts";
import {applyTiming, saveTiming} from "../timings/actions";
import {dlCodeSorter} from "../dlCodes/utils";

export interface DLStepsState {
    list: DLSteps;
    whereUsed: {
        id: number;
        list: DLCode[];
        status: 'idle' | 'loading' | 'rejected';
    };
    machines: string[];
    current: {
        id: number;
        step: DLStep | null;
        status: 'idle' | 'loading' | 'saving' | 'rejected';
        changed: boolean;
    }
    loading: boolean;
    loaded: boolean;
    filter: string;
    wcFilter: string;
    filterInactive: boolean;
    sort: SortProps<DLStep | DLBasicStep>;
}

export const initialStepsState = (): DLStepsState => ({
    list: {},
    whereUsed: {
        id: 0,
        list: [],
        status: 'idle',
    },
    machines: [],
    current: {
        id: 0,
        step: null,
        status: 'idle',
        changed: false,
    },
    loading: false,
    loaded: false,
    filter: '',
    wcFilter: '',
    filterInactive: LocalStore.getItem<boolean>(filterInactiveStepsKey, true) ?? true,
    sort: {field: 'id', ascending: true}
})


const dlStepsReducer = createReducer(initialStepsState, (builder) => {
    builder
        .addCase(loadDLSteps.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadDLSteps.fulfilled, (state, action) => {
            state.loading = false;
            state.list = {};
            action.payload.steps.forEach(step => {
                state.list[step.id] = step;
            })
            state.machines = action.payload.machines.sort();
            state.loaded = true;
        })
        .addCase(loadDLSteps.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setCurrentStep, (state, action) => {
            state.current.id = action.payload.id;
            state.current.step = action.payload;
            state.current.changed = false;
            state.whereUsed.id = action.payload.id;
            state.whereUsed.list = [];
        })
        .addCase(changeDLStep, (state, action) => {
            if (state.current.step) {
                state.current.step = {...state.current.step, ...action.payload};
                state.current.changed = true;
            }
        })
        .addCase(loadDLStep.pending, (state, action) => {
            state.current.status = 'loading';
            state.current.id = +action.meta.arg;
            if (state.whereUsed.id !== action.meta.arg) {
                state.whereUsed.id = +action.meta.arg;
                state.whereUsed.list = [];
            }
        })
        .addCase(loadDLStep.fulfilled, (state, action) => {
            state.current.status = 'idle';
            state.current.step = action.payload;
            state.current.changed = false;
        })
        .addCase(loadDLStep.rejected, (state) => {
            state.current.status = 'rejected';
        })
        .addCase(loadDLStepWhereUsed.pending, (state, action) => {
            state.whereUsed.status = 'loading';
            if (state.whereUsed.id !== action.meta.arg) {
                state.whereUsed.id = +action.meta.arg;
                state.whereUsed.list = [];
            }
        })
        .addCase(loadDLStepWhereUsed.fulfilled, (state, action) => {
            state.whereUsed.status = 'idle';
            state.whereUsed.list = action.payload.sort(dlCodeSorter({field: 'id', ascending: true}));
        })
        .addCase(loadDLStepWhereUsed.rejected, (state) => {
            state.whereUsed.status = 'idle';
        })
        .addCase(saveDLStep.pending, (state) => {
            state.current.status = 'saving';
        })
        .addCase(saveDLStep.fulfilled, (state, action) => {
            state.current.id = action.payload?.id ?? 0;
            state.current.status = 'idle';
            state.current.step = action.payload;
            state.current.changed = false;
            // state.whereUsed = status.payload?.whereUsed?.sort(dlCodeSorter({field: 'id', ascending: true}));
        })
        .addCase(saveDLStep.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(setStepSort, (state, action) => {
            state.sort = action.payload;
        })
        .addCase(setStepFilter, (state, action) => {
            state.filter = action.payload;
        })
        .addCase(setStepWCFilter, (state, action) => {
            state.wcFilter = action.payload;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.filterInactive = action.payload ?? !state.filterInactive;
        })
        .addCase(dismissAlert, (state, action) => {
            switch (action.payload.context) {
                case loadDLStep.typePrefix:
                    state.current.status = 'idle';
                    return;
                case loadDLStepWhereUsed.typePrefix:
                    state.whereUsed.status = 'idle';
                    return;
            }
        })
        .addCase(saveTiming.fulfilled, (state, action) => {
            if (action.payload?.step) {
                state.current.step = action.payload.step;
                state.list[action.payload.step.id] = action.payload.step;
            }
        })
        .addCase(applyTiming.pending, (state) => {
            state.current.status = 'saving';
        })
        .addCase(applyTiming.fulfilled, (state, action) => {
            state.current.status = 'idle';
            state.current.step = action.payload;
        })
        .addCase(applyTiming.rejected, (state) => {
            state.current.status = 'idle';
        })

})

export default dlStepsReducer;
