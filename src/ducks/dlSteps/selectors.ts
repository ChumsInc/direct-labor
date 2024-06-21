import {dlStepSorter, newDLStep} from "./utils";
import {RootState} from "../../app/configureStore";
import {DLStep, SortProps} from "chums-types";
import {createSelector} from "@reduxjs/toolkit";


export const selectStepsList = (state: RootState) => Object.values(state.dlSteps.list);
export const selectStepsSort = (state: RootState) => state.dlSteps.sort;
export const selectStepsMachines = (state: RootState) => state.dlSteps.machines;
export const selectCurrentStepId = (state: RootState) => state.dlSteps.current.id;
export const selectCurrentStep = (state: RootState) => state.dlSteps.current.step;
export const selectCurrentStepStatus = (state: RootState) => state.dlSteps.current.status;
export const selectCurrentStepLoading = (state: RootState) => state.dlSteps.current.status === 'loading';
export const selectedSavingSelector = (state: RootState) => state.dlSteps.current.status === 'saving';
export const selectedChangedSelector = (state: RootState) => state.dlSteps.current.changed;
export const selectStepsLoading = (state: RootState) => state.dlSteps.loading;
export const selectStepsLoaded = (state: RootState) => state.dlSteps.loaded;
export const filterSelector = (state: RootState): string => state.dlSteps.filter;
export const wcFilterSelector = (state: RootState): string => state.dlSteps.wcFilter;
export const filterInactiveSelector = (state: RootState): boolean => state.dlSteps.filterInactive;
export const selectStepsWhereUsed = (state: RootState) => state.dlSteps.whereUsed.list;

export const selectStepSelector = (key: number) => (state: RootState) => state.dlSteps.list[key] || newDLStep;

export const selectSortedStepsList = createSelector(
    [selectStepsList, selectStepsSort],
    (list, sort) => {
        return [...list].sort(dlStepSorter(sort));
    }
)
export const selectFilteredList = createSelector(
    [selectStepsList, selectStepsSort, filterSelector, wcFilterSelector, filterInactiveSelector],
    (list, sort, filter, wcFilter, filterInactive) => {
        let re = /^/;
        try {
            re = new RegExp(filter, 'i');
        } catch (err) {
        }

        return list
            .filter(dl => !filterInactive || dl.active)
            .filter(dl => !wcFilter || dl.workCenter === wcFilter)
            .filter(dl => re.test(dl.stepCode) || re.test(dl.description) || re.test(dl.machine))
            .sort(dlStepSorter(sort));
    }
)
export const filteredListSelector = (sort: SortProps<DLStep>) => (state: RootState): DLStep[] => {
    const {list, filter, wcFilter, filterInactive} = state.dlSteps;
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
