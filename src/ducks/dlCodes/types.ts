import {ActionInterface, SortableTableField, SorterProps} from "chums-ducks";
import {ActionInterfacePayload, defaultListState, ListState} from "../types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";

export interface DLCode {
    id: number,
    dlCode: string,
    workCenter: string,
    description: string,
    standardAllowedMinutes: number,
    laborBudget: number,
    fixedCosts: number,
    directLaborCost: number,
    timestamp: string,
}

export interface DLCodeList {
    [key:number]: DLCode,
}

export interface DLCodeStep {
    dlCode: string,
    id: number,
    stepOrder: number,
    stepCode: string,
    description: string,
    workCenter: string,
    machine: string,
    standardAllowedMinutes: number,
    fixedCosts: number,
}

export interface DLCodeSteps {
    [key:number]: DLCodeStep,
}

export interface SelectedDLCodeState {
    header: DLCode | null,
    steps: DLCodeSteps,
    loading: boolean,
    saving: boolean,
}

export interface DLCodesState extends ListState {
    list: DLCodeList,
    selected: SelectedDLCodeState,
}

export const defaultState: DLCodesState = {
    ...defaultListState,
    list: {},
    selected: {
        header: null,
        steps: {},
        saving: false,
        loading: false,
    },
}

export type DLCodeField = keyof DLCode;
export type DLCodeStepField = keyof DLCodeStep;

export interface DLCodesActionPayload extends ActionInterfacePayload {
    list?: DLCodeList,
    header?: DLCode | null,
    steps?: DLCodeSteps,
}

export interface DLCodesAction extends ActionInterface {
    payload?: DLCodesActionPayload
}

export interface DLCodesThunkAction extends ThunkAction<any, RootState, unknown, DLCodesAction> {
}

export interface DLCodeSorterProps extends SorterProps {
    field: DLCodeField,
}

export interface DLCodeTableField extends SortableTableField {
    field: DLCodeField,
}

export const defaultDLCodeSort: DLCodeSorterProps = {field: 'dlCode', ascending: true};

export const dlCodeKey = (dl: DLCode) => dl.id;

export const dlCodeSorter = ({field, ascending}: DLCodeSorterProps) =>
    (a: DLCode, b: DLCode): number => {
        return (
            a[field] === b[field]
                ? (dlCodeKey(a) > dlCodeKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };

export const dlCodeStepSorter = (a:DLCodeStep, b:DLCodeStep) => a.stepOrder - b.stepOrder;
