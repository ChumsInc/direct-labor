import type {RootState} from "../../app/configureStore";
import type {RoutingHeader} from "chums-types";
import {routingDetailSorter, routingHeaderSorter} from "./utils";
import type {RoutingDetailList} from "../types";
import {createSelector} from "@reduxjs/toolkit";

export const selectRoutingsList = (state: RootState) => state.routing.list.routings;
export const selectPage = (state: RootState) => state.routing.list.page;
export const selectRowsPerPage = (state: RootState) => state.routing.list.rowsPerPage;
export const selectSearch = (state: RootState): string => state.routing.list.search;
export const selectShowInactive = (state: RootState): boolean => state.routing.list.showInactive;
export const selectRoutingSort = (state: RootState) => state.routing.list.sort
export const selectLoading = (state: RootState): boolean => state.routing.list.loading === 'pending';
export const selectLoaded = (state: RootState): boolean => state.routing.list.loaded;
export const selectCurrentLoading = (state: RootState) => state.routing.current.loading;
export const selectCurrentRoutingNo = (state: RootState) => state.routing.current.routingNo;
export const selectCurrentHeader = (state: RootState): RoutingHeader | null => state.routing.current.header;
export const selectCurrentRoutingDetail = (state: RootState) => state.routing.current.detail ?? [];
export const selectRoutingDetailList = (state: RootState): RoutingDetailList => state.routing.detailList;

export const selectRoutings = createSelector(
    [selectRoutingsList, selectRoutingSort],
    (list, sort) => Object.values(list).sort(routingHeaderSorter(sort))
)

export const selectRoutingHeaderByKey = createSelector(
    [selectRoutingsList, (_, routingNo: string) => routingNo],
    (list, routingNo) => list[routingNo] ?? null
)

export const selectWhereUsedByRoutingKeys = createSelector(
    [selectRoutingDetailList, (_, keyList: string[]) => keyList],
    (detailList, keyList) => {
        return keyList.filter(key => !!detailList[key]).map(key => detailList[key]);
    }
)

export const selectCurrentDetail = createSelector(
    [selectCurrentRoutingDetail],
    (detail) => {
        return [...detail].sort(routingDetailSorter({field: 'StepNo', ascending: true}));
    }
)

export const selectSortedRoutingList = createSelector(
    [selectRoutings, selectSearch, selectShowInactive, selectRoutingSort],
    (list, search, showInactive, sort) => {
        let regEx = /^/i;
        try {
            if (search) {
                regEx = new RegExp(search, 'i');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            regEx = /^/i;
        }
        return list
            .filter(row => showInactive || (row.BillStatus && row.ItemStatus))
            .filter(row => !search || regEx.test(row.RoutingNo) || regEx.test(row.StepDescription))
            .sort(routingHeaderSorter(sort));
    }
)
