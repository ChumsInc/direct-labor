import {dlCodeSorter} from "./utils";
import type {DLCodeStep, DLCodeWorkTemplate} from "chums-types";
import {type RootState} from "@/app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {selectWorkCentersList} from "../workCenters/selectors";
import Decimal from "decimal.js";


export const selectDLCodesStatus = (state: RootState) => state.dlCodes.list.status;
export const selectLoaded = (state: RootState): boolean => state.dlCodes.list.loaded;
export const selectCurrentHeader = (state: RootState) => state.dlCodes.current.header;
export const selectCurrentDLCodeTemplates = (state: RootState):DLCodeWorkTemplate[] => state.dlCodes.current.templates ?? [];
export const selectCurrentSteps = (state: RootState): DLCodeStep[] => state.dlCodes.current.steps;
export const selectCurrentDLCodeStatus = (state: RootState) => state.dlCodes.current.status;
export const selectCurrentChanged = (state: RootState): boolean => state.dlCodes.current.changed;
export const selectFilter = (state: RootState): string => state.dlCodes.list.filters.search;
export const selectWorkCenterFilter = (state: RootState): string => state.dlCodes.list.filters.workCenter;
export const selectShowInactive = (state: RootState): boolean => state.dlCodes.list.filters.showInactive;
export const selectSort = (state: RootState) => state.dlCodes.list.sort;
export const selectDLCodesList = (state: RootState) => state.dlCodes.list.values;

export const selectSortedList = createSelector(
    [selectDLCodesList, selectFilter, selectWorkCenterFilter, selectShowInactive, selectSort],
    (list, search, wcFilter, showInactive, sort) => {
        let re = /^/;
        try {
            re = new RegExp(search, 'i');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
        }

        return list
            .filter(dl => showInactive || dl.active)
            .filter(dl => !wcFilter || dl.workCenter === wcFilter)
            .filter(dl => re.test(dl.dlCode) || re.test(dl.description) || re.test(dl.operationCode))
            .sort(dlCodeSorter(sort));
    }
)

export const selectCurrentDLSageRate = createSelector(
    [selectWorkCentersList, selectCurrentHeader],
    (workCenters, header) => {
        const workCenter = workCenters[header?.workCenter ?? ''] ?? null;
        const averageHourlyRate = workCenter?.averageHourlyRate ?? 0;
        const directLaborCost = header?.directLaborCost ?? null;
        const scalingFactorLabor = directLaborCost !== null
            ? new Decimal(averageHourlyRate).div(directLaborCost).toDecimalPlaces(3).toString()
            : null;
        return {averageHourlyRate, scalingFactorLabor}
    }
)
