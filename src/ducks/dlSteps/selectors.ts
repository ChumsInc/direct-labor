import {DLStep, DLStepSorterProps} from "../types";
import {RootState} from "../index";
import {dlStepSorter, dlStepTimingSorter, newDLStep} from "./types";
import {dlCodeSorter, DLCodeSorterProps} from "../dlCodes/types";

export const filteredListSelector = (sort: DLStepSorterProps) => (state: RootState): DLStep[] => {
    const {list, filter, wcFilter} = state.dlSteps;
    let re = /^/;
    try {
        re = new RegExp(filter, 'i');
    } catch (err) {
    }

    return Object.values(list)
        .filter(dl => !wcFilter || dl.workCenter === wcFilter)
        .filter(dl => re.test(dl.stepCode) || re.test(dl.description) || re.test(dl.machine))
        .sort(dlStepSorter(sort));
}

export const listSelector = (sort: DLStepSorterProps) => (state: RootState) => Object.values(state.dlSteps.list).sort(dlStepSorter(sort));
export const listLengthSelector = (state: RootState) => Object.values(state.dlSteps.list).length;
export const machinesSelector = (state: RootState) => state.dlSteps.machines;
export const selectStepSelector = (key: number) => (state: RootState) => state.dlSteps.list[key] || newDLStep;
export const selectedStepSelector = (state: RootState) => state.dlSteps.selected.step;
export const selectedStepTimingsSelector = (state: RootState) => (state.dlSteps.selected.step.timings || []).sort(dlStepTimingSorter);
export const selectedLoadingSelector = (state: RootState) => state.dlSteps.selected.loading;
export const selectedSavingSelector = (state: RootState) => state.dlSteps.selected.saving;
export const selectedChangedSelector = (state: RootState) => state.dlSteps.selected.changed;
export const loadingSelector = (state: RootState) => state.dlSteps.loading;
export const loadedSelector = (state: RootState) => state.dlSteps.loaded;
export const filterSelector = (state: RootState): string => state.dlSteps.filter;
export const wcFilterSelector = (state: RootState): string => state.dlSteps.wcFilter;
export const whereUsedSelector = (sort:DLCodeSorterProps) => (state:RootState) => state.dlSteps.whereUsed.sort(dlCodeSorter(sort));
