import {RootState} from "../index";
import {dlStepTimingSorter} from "./types";
import {DLTiming} from "../types";

export const listSelector = (state: RootState) => state.timings.list.sort(dlStepTimingSorter);
export const selectedTimingSelector = (state: RootState):DLTiming => state.timings.selected.timing;
export const selectedLoadingSelector = (state: RootState):boolean => state.timings.selected.loading;
export const selectedSavingSelector = (state: RootState):boolean => state.timings.selected.saving;
export const editTimingSelector = (state:RootState):boolean => state.timings.edit;

