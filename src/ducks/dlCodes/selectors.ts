import {dlCodeSorter, DLCodeSorterProps} from "./types";
import {RootState} from "../index";
import {DLCode, DLCodeStep} from "../types";
import {dlCodeStepSorter} from "./utils";

export const listSelector = (sort: DLCodeSorterProps) => (state: RootState): DLCode[] => {
    const {list, filter, wcFilter, filterInactive} = state.dlCodes;
    let re = /^/;
    try {

        re = new RegExp(filter, 'i');
    } catch (err) {
    }

    return Object.values(list)
        .filter(dl => !filterInactive || dl.active)
        .filter(dl => !wcFilter || dl.workCenter === wcFilter)
        .filter(dl => re.test(dl.dlCode) || re.test(dl.description) || re.test(dl.operationCode))
        .sort(dlCodeSorter(sort));
}

export const listLengthSelector = (state: RootState): number => Object.keys(state.dlCodes.list).length;
export const dlCodeSelector = (id: number) => (state: RootState): DLCode | null => state.dlCodes.list[id] || null;
export const loadingSelector = (state: RootState): boolean => state.dlCodes.loading;
export const loadedSelector = (state: RootState): boolean => state.dlCodes.loaded;
export const selectedHeaderSelector = (state: RootState): DLCode => state.dlCodes.selected.header;
export const selectedStepsSelector = (state: RootState): DLCodeStep[] => {
    const {steps} = state.dlCodes.selected;
    return Object.values(steps).sort(dlCodeStepSorter);
}
export const selectedLoadingSelector = (state: RootState): boolean => state.dlCodes.selected.loading;
export const selectedSavingSelector = (state: RootState): boolean => state.dlCodes.selected.saving;
export const selectedChangedSelector = (state: RootState): boolean => state.dlCodes.selected.changed;
export const filterSelector = (state: RootState): string => state.dlCodes.filter;
export const wcFilterSelector = (state: RootState): string => state.dlCodes.wcFilter;
export const filterInactiveSelector = (state:RootState): boolean => state.dlCodes.filterInactive;
