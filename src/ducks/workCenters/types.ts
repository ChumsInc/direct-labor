import {defaultListState, ListState, WorkCenterList} from "../types";
import {SortProps, WorkCenter} from "chums-types";


export interface WorkCenterState extends ListState {
    list: WorkCenterList,
    selected: WorkCenter | null,
    saving: boolean,
}

export const defaultState: WorkCenterState = {
    ...defaultListState,
    list: {},
    saving: false,
    filter: '',
}


export const defaultWorkCenterSort: SortProps<WorkCenter> = {field: 'WorkCenterCode', ascending: true};

export const workCenterKey = (wc: WorkCenter) => wc.WorkCenterCode;

export const workCenterSorter = ({field, ascending}: SortProps<WorkCenter>) =>
    (a: WorkCenter, b: WorkCenter): number => {
        return (
            a[field] === b[field]
                ? (workCenterKey(a) > workCenterKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };
