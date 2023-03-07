import {ActionInterface, SortableTableField, SorterProps} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {
    ActionInterfacePayload,
    defaultListState,
    ListState,
    WorkCenter,
    WorkCenterField,
    WorkCenterList
} from "../types";
import {RootState} from "../../app/configureStore";


export interface WorkCenterPayload extends ActionInterfacePayload {
    list?: WorkCenterList,
    selected?: WorkCenter | null,
    rate?: number,
}
export interface WorkCenterAction extends ActionInterface {
    payload?: WorkCenterPayload,
}

export interface WorkCenterThunkAction extends ThunkAction<any, RootState, unknown, WorkCenterAction> {}

export interface WorkCenterState extends ListState {
    list: WorkCenterList,
    selected: WorkCenter|null,
    saving: boolean,
}

export const defaultState:WorkCenterState = {
    ...defaultListState,
    list: {},
    saving: false,
    filter: '',
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
