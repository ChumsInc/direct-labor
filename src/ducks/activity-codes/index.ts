import {ActivityCode, Editable, SortProps, WorkTemplateStep} from "chums-types";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadActivityCodes,
    setACTemplateStepsSort,
    setActivityCodeSearch,
    setActivityCodeSort,
    setActivityCodesWorkCenter,
    setCurrentActivityCode,
    toggleActivityCodesWOTemplates,
    toggleUnratedWorkCenters
} from "./actions";
import {activityCodeKey, activityCodeSorter} from "./utils";


const defaultSort: SortProps<ActivityCode> = {field: "ActivityCode", ascending: true};

export interface ActivityCodesState {
    list: {
        activityCodes: ActivityCode[],
        status: 'idle' | 'loading',
        loaded: boolean;
        filter: {
            workCenter: string;
            unratedWorkCenters: boolean;
            search: string;
            showItemsWithoutTemplates: boolean;
        },
        sort: SortProps<ActivityCode>
    },
    current: {
        key: string,
        activityCode: (ActivityCode & Editable) | null;
        status: 'idle' | 'loading';
        steps: WorkTemplateStep[];
        stepsSort: SortProps<WorkTemplateStep>;
    }
}

export const initialState: ActivityCodesState = {
    list: {
        activityCodes: [],
        status: 'idle',
        loaded: false,
        filter: {
            workCenter: '',
            unratedWorkCenters: false,
            search: '',
            showItemsWithoutTemplates: false,
        },
        sort: {...defaultSort}
    },
    current: {
        key: '',
        activityCode: null,
        status: 'idle',
        steps: [],
        stepsSort: {field: "TemplateNo", ascending: true}
    }
}

const activityCodesReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadActivityCodes.pending, (state) => {
            state.list.status = 'loading';
        })
        .addCase(loadActivityCodes.fulfilled, (state, action) => {
            state.list.status = 'idle';
            state.list.loaded = true;
            state.list.activityCodes = action.payload.sort(activityCodeSorter(defaultSort));
            if (state.current.key) {
                const [ac] = state.list.activityCodes.filter(ac => activityCodeKey(ac) === state.current.key);
                state.current.activityCode = ac ?? null;
                if (!ac) {
                    state.current.key = '';
                    state.current.steps = [];
                }
            }
        })
        .addCase(loadActivityCodes.rejected, (state) => {
            state.list.status = 'idle';
        })
        .addCase(setCurrentActivityCode.pending, (state, action) => {
            state.current.status = 'loading';
            if (activityCodeKey(action.meta.arg) !== state.current.key) {
                state.current.key = activityCodeKey(action.meta.arg);
                state.current.steps = [];
                const [activityCode] = state.list.activityCodes.filter(ac => activityCodeKey(ac) === state.current.key);
                state.current.activityCode = activityCode ?? null;
            }
        })
        .addCase(setCurrentActivityCode.fulfilled, (state, action) => {
            state.current.status = 'idle';
            state.current.activityCode = action.payload?.activityCode ?? null;
            state.current.steps = action.payload?.steps ?? [];
        })
        .addCase(setCurrentActivityCode.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(setActivityCodeSort, (state, action) => {
            state.list.sort = action.payload;
        })
        .addCase(setActivityCodeSearch, (state, action) => {
            state.list.filter.search = action.payload;
        })
        .addCase(setActivityCodesWorkCenter, (state, action) => {
            state.list.filter.workCenter = action.payload;
        })
        .addCase(toggleUnratedWorkCenters, (state, action) => {
            state.list.filter.unratedWorkCenters = action.payload ?? !state.list.filter.unratedWorkCenters;
        })
        .addCase(setACTemplateStepsSort, (state, action) => {
            state.current.stepsSort = action.payload;
        })
        .addCase(toggleActivityCodesWOTemplates, (state, action) => {
            state.list.filter.showItemsWithoutTemplates = action.payload ?? !state.list.filter.showItemsWithoutTemplates;
        })
});

export default activityCodesReducer;
