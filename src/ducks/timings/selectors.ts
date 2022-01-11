import {RootState} from "../index";
import {dlStepTimingSorter} from "./types";
import {DLTiming} from "../types";

export const selectTimingList = (state: RootState) => state.timings.list.sort(dlStepTimingSorter);
export const selectCurrentTiming = (state: RootState):DLTiming => state.timings.selected.timing;
export const selectCurrentLoading = (state: RootState):boolean => state.timings.selected.loading;
export const selectCurrentSaving = (state: RootState):boolean => state.timings.selected.saving;
export const selectTimingsIsEditing = (state:RootState):boolean => state.timings.edit;

