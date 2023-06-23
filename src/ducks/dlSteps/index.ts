import {DLCode, DLStep, DLSteps} from "../types";
import {defaultDLStepSort, newDLStep} from "./types";
import {defaultDLCodeSort, dlCodeSorter} from "../dlCodes/types";
import {tabID} from "./constants";
import {createReducer, EmptyObject} from "@reduxjs/toolkit";
import {
    dlStepChangedAction,
    dlStepChangeTimingAction,
    filterInactiveAction,
    loadDLStepAction,
    loadDLStepsAction,
    saveDLStepAction,
    setDLStepFilterAction, setStepsPage, setStepsRowsPerPage,
    setWCFilterAction
} from "./actions";
import {filterInactiveStepsKey, stepsRowsPerPageKey} from "../../utils/preferences";
import {getPreference} from "../../api/preferences";
import {SortProps} from "chums-types";

export interface DLStepsState {
    list: DLSteps;
    tab: string;
    whereUsed: DLCode[];
    machines: string[];
    current: {
        step: DLStep | null;
        loading: boolean;
        saving: boolean;
        changed: boolean;
    }
    loading: boolean;
    loaded: boolean;
    filter: string;
    wcFilter: string;
    filterInactive: boolean;
    sort: SortProps<DLStep>;
    page: number;
    rowsPerPage: number;
}

export const initialStepsState: DLStepsState = {
    list: {},
    tab: tabID.settings,
    whereUsed: [],
    machines: [],
    current: {
        step: null,
        loading: false,
        saving: false,
        changed: false,
    },
    loading: false,
    loaded: false,
    filter: '',
    wcFilter: '',
    filterInactive: getPreference(filterInactiveStepsKey, true),
    sort: {...defaultDLStepSort},
    page: 0,
    rowsPerPage: getPreference(stepsRowsPerPageKey, 25),
}

const dlStepsReducer = createReducer(initialStepsState, builder => {
    builder
        .addCase(dlStepChangedAction, (state, action) => {
            state.current.step = {...state.current.step, ...action.payload} as DLStep;
            state.current.changed = true;
        })
        .addCase(dlStepChangeTimingAction, (state, action) => {
            if (state.current.step) {
                const laborCost = state.current.step.averageHourlyRate / 60 * action.payload.standardAllowedMinutes;
                state.current.step = {
                    ...state.current.step,
                    idCurrentTiming: action.payload.id,
                    standardAllowedMinutes: action.payload.standardAllowedMinutes,
                    laborCost: laborCost,
                    stepCost: state.current.step.fixedCosts + laborCost,
                }
            }
        })
        .addCase(filterInactiveAction, (state, action) => {
            state.filterInactive = action.payload;
        })
        .addCase(setWCFilterAction, (state, action) => {
            state.wcFilter = action.payload;
        })
        .addCase(setDLStepFilterAction, (state, action) => {
            state.filter = action.payload;
        })
        .addCase(loadDLStepsAction.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadDLStepsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.machines = [...action.payload.machines].sort();
            state.list = action.payload.list;
            state.loaded = true;
        })
        .addCase(loadDLStepAction.pending, (state, action) => {
            state.whereUsed = [];
            state.current.changed = false;
            state.current.loading = true;
            state.current.step = {
                ...newDLStep,
                ...action.meta.arg,
            }
        })
        .addCase(loadDLStepAction.fulfilled, (state, action) => {
            state.whereUsed = [...action.payload.whereUsed].sort(dlCodeSorter(defaultDLCodeSort));
            state.current.step = action.payload.step;
            state.current.loading = false;
            state.current.changed = false;
        })
        .addCase(loadDLStepAction.rejected, (state) => {
            state.current.loading = false;
        })
        .addCase(saveDLStepAction.pending, (state) => {
            state.current.loading = true;
        })
        .addCase(saveDLStepAction.fulfilled, (state, action) => {
            state.whereUsed = [...action.payload.whereUsed].sort(dlCodeSorter(defaultDLCodeSort));
            state.current.step = action.payload.step;
            state.current.loading = false;
            state.current.changed = false;
        })
        .addCase(saveDLStepAction.rejected, (state) => {
            state.current.loading = false;
        })
        .addCase(setStepsPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setStepsRowsPerPage, (state, action) => {
            state.page = 0;
            state.rowsPerPage = action.payload;
        })
})
export default dlStepsReducer;
