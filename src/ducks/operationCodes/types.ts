import {ActionInterface, SortableTableField, SorterProps} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {GLAccount} from "../glAccounts";
import {WorkCenter, WorkCenterSorterProps} from "../workCenters/types";
import {RoutingDetail} from "../routing";
import {ActionInterfacePayload, defaultListState, ListState} from "../types";

export interface OperationCode {
    WorkCenter: string,
    OperationCode: string,
    OperationDescription: string,
    StdRatePiece: number,
    PlannedPieceCostDivisor: number,
    WipDirectAcct: string,
    WipFixOverhdAcct: string,
    WipVariableOvhdAcct: string,
    AppliedDirectAcct: string,
    AppliedFixedOvhdAcct: string,
    FixedOvhdPercentOfCost: number,
}

export interface OperationCodeList {
    [key:string]: OperationCode,
}

export type OperationCodeField = keyof OperationCode;

export interface OperationCodeActionPayload extends ActionInterfacePayload {
    list?: OperationCodeList,
    selected?: OperationCode|null,
    accounts?: GLAccount[],
    routings?: RoutingDetail[],
}
export interface OperationCodeAction extends ActionInterface {
    payload?: OperationCodeActionPayload,
}
export interface OperationCodeThunkAction extends ThunkAction<any, RootState, unknown, OperationCodeAction> {}

export interface OperationCodeSorterProps extends SorterProps {
    field: OperationCodeField
}

export interface OperationCodeTableField extends SortableTableField {
    field: OperationCodeField
}

export const operationCodeKey = (oc?:OperationCode|null) => !!oc ? [oc.WorkCenter, oc.OperationCode].join(':') : '';
export const operationCodeSearchKey = ({workCenter, operationCode}:{workCenter:string, operationCode:string}) => [workCenter, operationCode].join(':');

export const operationCodeDefaultSort:OperationCodeSorterProps = {field: 'WorkCenter', ascending:true};

export const operationCodeSorter = ({field, ascending}: OperationCodeSorterProps) =>
    (a: OperationCode, b: OperationCode): number => {
        return (
            a[field] === b[field]
                ? (operationCodeKey(a) > operationCodeKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };

export interface OperationCodeState extends ListState {
    list: OperationCodeList,
    selected: OperationCode|null,
    whereUsed: string[],
    filterWC: string,
}

export const defaultState:OperationCodeState = {
    ...defaultListState,
    list: {},
    selected: null,
    whereUsed: [],
    filterWC: '',
}
