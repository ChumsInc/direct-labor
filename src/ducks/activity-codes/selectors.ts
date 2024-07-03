import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {activityCodeSorter} from "./utils";
import {selectRatedWorkCenterCodes} from "../workCenters/selectors";
import {TemplateStepSorter} from "../templates/utils";
import {selectDLCodesList} from "../dlCodes/selectors";
import {DLCode} from "chums-types";
import {getPreference, localStorageKeys} from "../../api/preferences";

export const selectActivityCodes = (state: RootState) => state.activityCodes.list.activityCodes;
export const selectActivityCodesStatus = (state: RootState) => state.activityCodes.list.status;
export const selectActivityCodesLoaded = (state: RootState) => state.activityCodes.list.loaded;
export const selectActivityCodesFilter = (state: RootState) => state.activityCodes.list.filter.search;
export const selectActivityCodesWorkCenter = (state: RootState) => state.activityCodes.list.filter.workCenter;
export const selectActivityCodesSort = (state: RootState) => state.activityCodes.list.sort;
export const selectActivityCodesUnratedWCs = (state: RootState) => state.activityCodes.list.filter.unratedWorkCenters;
export const selectActivityCodesWithoutTemplates = (state:RootState) => state.activityCodes.list.filter.showItemsWithoutTemplates;

export const selectCurrentActivityCodeKey = (state: RootState) => state.activityCodes.current.key;
export const selectCurrentActivityCode = (state: RootState) => state.activityCodes.current.activityCode;
export const selectCurrentActivityCodeStatus = (state: RootState) => state.activityCodes.current.status;
export const _selectCurrentActivityCodeSteps = (state: RootState) => state.activityCodes.current.steps;
export const selectCurrentActivityCodeStepSort = (state: RootState) => state.activityCodes.current.stepsSort;


export const selectSortedActivityCodes = createSelector(
    [selectActivityCodes, selectActivityCodesFilter, selectActivityCodesWorkCenter, selectActivityCodesSort, selectActivityCodesUnratedWCs, selectActivityCodesWithoutTemplates],
    (list, filter, workCenter, sort, unrated, withoutTemplates) => {
        const workCenters = getPreference<string[]>(localStorageKeys.ratedWorkCenters, []);
        return list
            .filter(ac => !filter || ac.ActivityCode.toLocaleLowerCase().includes(filter.toLowerCase()) || ac.ActivityDesc?.toLowerCase()?.includes(filter.toLowerCase()))
            .filter(ac => !workCenter || ac.WorkCenter === workCenter)
            .filter(ac => unrated || workCenters.includes(ac.WorkCenter))
            .filter(ac => withoutTemplates || (ac.TemplateCount ?? 0) > 0)
            .sort(activityCodeSorter(sort))
    }
)

export const selectCurrentActivityCodeSteps = createSelector(
    [_selectCurrentActivityCodeSteps, selectCurrentActivityCodeStepSort],
    (list, sort) => {
        return [...list]
            .sort(TemplateStepSorter(sort))
    }
)

export const selectCurrentActivityDLCodes = createSelector(
    [selectCurrentActivityCode, selectDLCodesList],
    (current, dlCodesList) => {
        const dlCodes:DLCode[] = Object.values(dlCodesList);
        return dlCodes
            .filter(code => code.activityCode === current?.ActivityCode)
            .filter(code => code.workCenter === current?.WorkCenter);
    }
)
