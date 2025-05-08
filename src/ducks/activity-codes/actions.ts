import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchActivityCode, fetchActivityCodes} from "./api";
import {ActivityCode, SortProps, WorkTemplateStep} from "chums-types";
import {RootState} from "@/app/configureStore";
import {selectActivityCodesStatus, selectCurrentActivityCodeStatus} from "./selectors";
import {LoadActivityCodeResponse} from "../types";

export const setActivityCodeSort = createAction<SortProps<ActivityCode>>('activityCodes/list/setSort');
export const setActivityCodeSearch = createAction<string>('activityCodes/list/filter/search');
export const setActivityCodesWorkCenter = createAction<string>('activityCodes/list/filter/workCenter');
export const toggleUnratedWorkCenters = createAction<boolean|undefined>('activityCodes/list/filter/toggleUnratedWorkCenters');
export const toggleActivityCodesWOTemplates = createAction<boolean|undefined>('activityCodes/list/filter/toggleActivityCodesWOTemplates');

export const setACTemplateStepsSort = createAction<SortProps<WorkTemplateStep>>('activityCodes/current/setStepsSort');

export const loadActivityCodes = createAsyncThunk<ActivityCode[]>(
    'activityCodes/load',
    async () => {
        return await fetchActivityCodes()
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectActivityCodesStatus(state) === 'idle'
        }
    }
)

export const setCurrentActivityCode = createAsyncThunk<LoadActivityCodeResponse | null, Pick<ActivityCode, 'WorkCenter'|'ActivityCode'>>(
    'activityCodes/current/load',
    async (arg) => {
        return await fetchActivityCode(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.WorkCenter && !!arg.ActivityCode
                && selectCurrentActivityCodeStatus(state) === 'idle';
        }
    }
)
