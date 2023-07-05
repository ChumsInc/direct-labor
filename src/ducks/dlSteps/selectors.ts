import {DLStep} from "chums-types";
import {dlStepSorter, dlStepTimingSorter, newDLStep} from "./types";
import {dlCodeSorter, DLCodeSorterProps} from "../dlCodes/types";
import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {DLCode, SortProps} from "chums-types";

export const selectStepsList = (state: RootState) => state.dlSteps.list;

export const listSelector = (sort: SortProps<DLStep>) => (state: RootState) => Object.values(state.dlSteps.list).sort(dlStepSorter(sort));
export const listLengthSelector = (state: RootState) => Object.values(state.dlSteps.list).length;
export const selectMachines = (state: RootState) => state.dlSteps.machines;
export const selectStepSelector = (key: number) => (state: RootState) => state.dlSteps.list[key] ?? newDLStep;
export const selectCurrentStep = (state: RootState) => state.dlSteps.current.step;
export const selectedStepTimingsSelector = (state: RootState) => (state.dlSteps.current.step?.timings ?? []).sort(dlStepTimingSorter);
export const selectCurrentStepLoading = (state: RootState) => state.dlSteps.current.loading;
export const selectCurrentStepSaving = (state: RootState) => state.dlSteps.current.saving;
export const selectCurrentStepChanged = (state: RootState) => state.dlSteps.current.changed;
export const selectStepsLoading = (state: RootState) => state.dlSteps.loading;
export const selectStepsLoaded = (state: RootState) => state.dlSteps.loaded;
export const selectStepsFilter = (state: RootState): string => state.dlSteps.filter;
export const selectStepsWCFilter = (state: RootState): string => state.dlSteps.wcFilter;
export const selectStepsInactiveFilter = (state: RootState): boolean => state.dlSteps.filterInactive;
export const selectWhereUsedList = (state:RootState) => state.dlSteps.whereUsed.list;
export const selectWhereUsedSort = (state:RootState) => state.dlSteps.whereUsed.sort;
export const selectWhereUsed = createSelector(
    [selectWhereUsedList, selectWhereUsedSort],
    (list, sort) => [...list].sort(dlCodeSorter(sort))
)


export const selectStepsPage = (state: RootState) => state.dlSteps.page;
export const selectRowsPerPage = (state: RootState) => state.dlSteps.rowsPerPage;
export const selectStepsSort = (state: RootState) => state.dlSteps.sort;

export const selectFilteredStepsList = createSelector(
    [selectStepsList, selectStepsFilter, selectStepsWCFilter, selectStepsInactiveFilter, selectStepsSort],
    (list, filter, wcFilter, filterInactive, sort) => {
        let re = /^/;
        try {
            re = new RegExp(filter, 'i');
        } catch (err) {
        }

        return Object.values(list)
            .filter(dl => !filterInactive || dl.active)
            .filter(dl => !wcFilter || dl.workCenter === wcFilter)
            .filter(dl => re.test(dl.stepCode) || re.test(dl.description) || re.test(dl.machine))
            .sort(dlStepSorter(sort));

    }
)
