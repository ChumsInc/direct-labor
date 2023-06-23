import {DLStepResponse} from "./types";
import {DLBasicStep, DLStep, DLTiming} from "../types";
import {
    filterChanged,
    filterInactiveChanged,
    stepChanged,
    stepsLoadList,
    stepsLoadStep,
    stepTimingChanged,
    wcFilterChanged
} from "./actionTypes";
import {selectStepsLoading, selectCurrentStepLoading} from "./selectors";
import {filterInactiveStepsKey, setPreference, stepsRowsPerPageKey} from "../../utils/preferences";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {getPreference} from "../../api/preferences";
import {fetchDLStep, fetchDLSteps, postDLStep} from "../../api/dl-steps";
import {RootState} from "../../app/configureStore";
import {SortProps} from "chums-types";

const listURL = `/api/operations/production/dl/steps`;
const stepURL = (step: DLBasicStep) => `/api/operations/production/dl/steps/${encodeURIComponent(step.id)}`;

export const dlStepChangedAction = createAction<Partial<DLStep>>(stepChanged);
export const dlStepChangeTimingAction = createAction<DLTiming>(stepTimingChanged);

export const filterInactiveAction = createAction(filterInactiveChanged, (arg: boolean) => {
    setPreference(filterInactiveStepsKey, arg ?? !getPreference(filterInactiveStepsKey, false));
    return {payload: arg};
});

export const setWCFilterAction = createAction<string>(wcFilterChanged);
export const setDLStepFilterAction = createAction<string>(filterChanged)
export const setStepsSort = createAction<SortProps<DLStep>>('steps/setSort');
export const setStepsPage = createAction<number>('steps/setPage');
export const setStepsRowsPerPage = createAction('steps/setRowsPerPage', (arg:number) => {
    setPreference(stepsRowsPerPageKey, arg);
    return {payload: arg};
})

export const loadDLStepsAction = createAsyncThunk(
    stepsLoadList,
    async () => {
        return await fetchDLSteps();
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectStepsLoading(state);
        }
    }
)

export const loadDLStepAction = createAsyncThunk<DLStepResponse, DLBasicStep>(
    stepsLoadStep,
    async (arg) => {
        return await fetchDLStep(arg.id);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCurrentStepLoading(state);
        }
    }
)


export const saveDLStepAction = createAsyncThunk<DLStepResponse, DLStep>(
    'steps/current/save',
    async (arg) => {
        return await postDLStep(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCurrentStepLoading(state);
        }
    }
)
