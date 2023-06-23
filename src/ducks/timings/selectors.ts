import {dlStepTimingSorter} from "./types";
import {DLTiming} from "../types";
import {RootState} from "../../app/configureStore";

export const selectTimingList = (state: RootState) => state.timings.list.sort(dlStepTimingSorter);
export const selectCurrentTiming = (state: RootState) => state.timings.current.timing;
export const selectCurrentLoading = (state: RootState) => state.timings.current.loading;
export const selectCurrentSaving = (state: RootState) => state.timings.current.saving;
export const selectTimingsIsEditing = (state:RootState) => state.timings.edit;

