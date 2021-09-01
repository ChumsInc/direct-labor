import {ActionInterface, SorterProps} from "chums-ducks";
import {
    ActionInterfacePayload,
    defaultListState,
    DLCode,
    DLCodeField,
    DLCodeList,
    DLCodeSteps,
    ListState
} from "../types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";

export const newDLCode:DLCode = {
    id: 0,
    dlCode: '',
    workCenter: '',
    operationCode: '',
    description: '',
    standardAllowedMinutes: 0,
    laborBudget: 0,
    fixedCosts: 0,
    directLaborCost: 0,
    StdRatePiece: 0,
    timestamp: '',
}

export interface SelectedDLCodeState {
    header: DLCode,
    steps: DLCodeSteps,
    loading: boolean,
    saving: boolean,
    changed?: boolean,
}


export interface DLCodesState extends ListState {
    list: DLCodeList,
    selected: SelectedDLCodeState,
    wcFilter: string,
}

export const defaultState: DLCodesState = {
    ...defaultListState,
    list: {},
    selected: {
        header: newDLCode,
        steps: {},
        saving: false,
        loading: false,
    },
    wcFilter: '',
}

export interface DLCodesActionPayload extends ActionInterfacePayload {
    list?: DLCodeList,
    header?: DLCode | null,
    steps?: DLCodeSteps,
    change?: object,
    id?:number,
}

export interface DLCodesAction extends ActionInterface {
    payload?: DLCodesActionPayload
}

export interface DLCodesThunkAction extends ThunkAction<any, RootState, unknown, DLCodesAction> {
}

export const defaultDLCodeSort: DLCodeSorterProps = {field: 'dlCode', ascending: true};

export const dlCodeKey = (dl: DLCode) => dl.id;

export interface DLCodeSorterProps extends SorterProps {
    field: DLCodeField,
}

export const dlCodeSorter = ({field, ascending}: DLCodeSorterProps) =>
    (a: DLCode, b: DLCode): number => {
        return (
            a[field] === b[field]
                ? (dlCodeKey(a) > dlCodeKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };


