import {ActionInterface, SortableTableField, SorterProps} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {GLAccount} from "../glAccounts";
import {WorkCenter, WorkCenterSorterProps} from "../workCenters/types";
import {RoutingDetail} from "../routing";

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

export type OperationCodeField = keyof OperationCode;

export interface OperationCodeAction extends ActionInterface {
    payload?: {
        list?: OperationCode[],
        selected?: OperationCode|null,
        accounts?: GLAccount[],
        routings?: RoutingDetail[],
        filter?: string,
        error?: Error,
        context?: string,
    }
}
export interface OperationCodeThunkAction extends ThunkAction<any, RootState, unknown, OperationCodeAction> {}

export interface OperationCodeSorterProps extends SorterProps {
    field: OperationCodeField
}

export interface OperationCodeTableField extends SortableTableField {
    field: OperationCodeField
}

export const operationCodeKey = (oc?:OperationCode|null) => !!oc ? [oc.WorkCenter, oc.OperationCode].join(':') : '';

export const operationCodeDefaultSort:OperationCodeSorterProps = {field: 'WorkCenter', ascending:true};

export const operationCodeSorter = ({field, ascending}: OperationCodeSorterProps) =>
    (a: OperationCode, b: OperationCode): number => {
        return (
            a[field] === b[field]
                ? (operationCodeKey(a) > operationCodeKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };

export interface OperationCodeState {
    list: OperationCode[],
    selected: OperationCode|null,
    whereUsed: string[],
    filterWC: string,
    search: string,
    loading: boolean,
    loaded: boolean,
}

export const defaultState:OperationCodeState = {
    list: [],
    selected: null,
    whereUsed: [],
    filterWC: '',
    search: '',
    loading: false,
    loaded: false,
}
