import {ActionInterface, SortableTableField, SorterProps} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";


export interface WorkCenter {
    Company: string,
    WorkCenterCode: string,
    Description: string,
    CommentLine1: string,
    CommentLine2: string,
    ChrgAtEmpRate: boolean,
    OutsideProcessing: boolean,
    isStandardWC: boolean,
    AverageHourlyRate: number|null,
    changed?: boolean,
}

export type WorkCenterField = keyof WorkCenter;

export interface WorkCenterAction extends ActionInterface {
    payload?: {
        list?: WorkCenter[],
        selected?: WorkCenter | null,
        rate?: number,
        error?: Error,
        context?: string,
    }
}


export interface WorkCenterThunkAction extends ThunkAction<any, RootState, unknown, WorkCenterAction> {}

export interface WorkCenterState {
    list: WorkCenter[],
    selected: WorkCenter|null,
    loading: boolean,
    loaded: boolean,
    saving: boolean,
}

export const defaultState:WorkCenterState = {
    list: [],
    selected: null,
    loading: false,
    loaded: false,
    saving: false
}

export interface WorkCenterSorterProps extends SorterProps {
    field: WorkCenterField
}

export interface  WorkCenterTableField extends SortableTableField {
    field: WorkCenterField,
}

export const defaultWorkCenterSort:WorkCenterSorterProps = {field: 'WorkCenterCode', ascending: true};

export const workCenterKey = (wc:WorkCenter) => wc.WorkCenterCode;

export const workCenterSorter = ({field, ascending}: WorkCenterSorterProps) =>
    (a: WorkCenter, b: WorkCenter): number => {
        return (
            a[field] === b[field]
                ? (workCenterKey(a) > workCenterKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };
