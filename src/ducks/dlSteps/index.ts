import type {DLBasicStep, DLCode, DLStep, SortProps} from "chums-types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {LocalStore} from "@chumsinc/ui-utils";
import {filterWorkCenterKey, showInactiveStepsKey} from "@/utils/preferences";
import {loadDLStep, loadDLSteps, loadDLStepWhereUsed, saveDLStep, setCurrentStep} from "./actions";
import {dismissAlert} from "@chumsinc/alert-list";
import {applyTiming, saveTiming} from "../timings/actions";
import {dlCodeSorter} from "../dlCodes/utils";
import {dlStepSorter} from "./utils";

const stepsAdapter = createEntityAdapter<DLStep, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
})

const selectors = stepsAdapter.getSelectors();


export interface DLStepsState {
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
    showInactive: boolean;
    sort: SortProps<DLStep | DLBasicStep>;
}

export const initialStepsState = (): DLStepsState => ({
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
    wcFilter: LocalStore.getItem<string>(filterWorkCenterKey, '') ?? '',
    showInactive: LocalStore.getItem<boolean>(showInactiveStepsKey, true) ?? true,
    sort: {field: 'stepCode', ascending: true}
})

const stepsSlice = createSlice({
    name: 'dlSteps',
    initialState: stepsAdapter.getInitialState(initialStepsState()),
    reducers: {
        changeDLStep: (state, action: PayloadAction<Partial<DLStep>>) => {
            if (state.current.step) {
                state.current.step = {...state.current.step, ...action.payload};
                state.current.changed = true;
            }
        },
        setStepSort: (state, action: PayloadAction<SortProps<DLStep | DLBasicStep>>) => {
            state.sort = action.payload;
        },
        setStepWCFilter: (state, action: PayloadAction<string>) => {
            state.wcFilter = action.payload;
        },
        setStepFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
        toggleShowInactive: (state, action: PayloadAction<boolean | undefined>) => {
            state.showInactive = action.payload ?? !state.showInactive;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadDLSteps.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadDLSteps.fulfilled, (state, action) => {
                state.loading = false;
                stepsAdapter.setAll(state, action.payload.steps);
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
                if (action.payload) {
                    stepsAdapter.setOne(state, action.payload);
                }
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
                if (action.payload) {
                    stepsAdapter.setOne(state, action.payload);
                }
                // state.whereUsed = status.payload?.whereUsed?.currentSort(dlCodeSorter({field: 'id', ascending: true}));
            })
            .addCase(saveDLStep.rejected, (state) => {
                state.current.status = 'idle';
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
                    stepsAdapter.setOne(state, action.payload.step);
                }
            })
            .addCase(applyTiming.pending, (state) => {
                state.current.status = 'saving';
            })
            .addCase(applyTiming.fulfilled, (state, action) => {
                state.current.status = 'idle';
                state.current.step = action.payload;
                if (action.payload) {
                    stepsAdapter.setOne(state, action.payload);
                }
            })
            .addCase(applyTiming.rejected, (state) => {
                state.current.status = 'idle';
            })
    },
    selectors: {
        selectSteps: (state) => selectors.selectAll(state),
        selectStepsSort: (state) => state.sort,
        selectStepsMachines: (state) => state.machines,
        selectCurrentStepId: (state) => state.current.id,
        selectCurrentStep: (state) => state.current.step,
        selectCurrentStepStatus: (state) => state.current.status,
        selectCurrentStepLoading: (state) => state.current.status === 'loading',
        selectedSavingSelector: (state) => state.current.status === 'saving',
        selectedChangedSelector: (state) => state.current.changed,
        selectStepsLoading: (state) => state.loading,
        selectStepsLoaded: (state) => state.loaded,
        selectStepsFilter: (state): string => state.filter,
        selectWCFilter: (state): string => state.wcFilter,
        selectShowInactive: (state): boolean => state.showInactive,
        selectStepsWhereUsed: (state) => state.whereUsed.list,
    }
});

export const {changeDLStep, setStepWCFilter, setStepFilter, setStepSort, toggleShowInactive} = stepsSlice.actions;
export const {
    selectSteps,
    selectCurrentStep,
    selectCurrentStepLoading,
    selectCurrentStepStatus,
    selectStepsLoading,
    selectStepsLoaded,
    selectStepsMachines,
    selectCurrentStepId,
    selectStepsWhereUsed,
    selectWCFilter,
    selectShowInactive,
    selectStepsSort,
    selectedChangedSelector,
    selectedSavingSelector,
    selectStepsFilter,
} = stepsSlice.selectors;

export const selectSortedStepsList = createSelector(
    [selectSteps, selectStepsSort],
    (list, sort) => {
        return [...list].sort(dlStepSorter(sort));
    }
)
export const selectFilteredList = createSelector(
    [selectSteps, selectStepsSort, selectStepsFilter, selectWCFilter, selectShowInactive],
    (list, sort, filter, wcFilter, showInactive) => {
        let re = /^/;
        try {
            re = new RegExp(filter, 'i');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            // do nothing;
        }

        return list
            .filter(dl => showInactive || dl.active)
            .filter(dl => !wcFilter || dl.workCenter === wcFilter)
            .filter(dl => re.test(dl.stepCode) || re.test(dl.description) || re.test(dl.machine))
            .sort(dlStepSorter(sort));
    }
)

export default stepsSlice;
