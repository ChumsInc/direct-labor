import {ActionInterface, SorterProps} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {
    ActionInterfacePayload,
    defaultListState,
    GLAccount,
    ListState,
    OperationCode,
    OperationCodeField,
    OperationCodeKey,
    OperationCodeList,
    RoutingDetail
} from "../types";
import {RootState} from "../../app/configureStore";
import {SortProps} from "chums-types";


export interface OperationCodeActionPayload extends ActionInterfacePayload {
    list?: OperationCodeList,
    selected?: OperationCode | null,
    accounts?: GLAccount[],
    routings?: RoutingDetail[],
}

export interface OperationCodeAction extends ActionInterface {
    payload?: OperationCodeActionPayload,
}

export interface OperationCodeThunkAction extends ThunkAction<any, RootState, unknown, OperationCodeAction> {
}

export const operationCodeKey = (oc?: OperationCodeKey | null) => !!oc ? [oc.WorkCenter, oc.OperationCode].join(':') : '';


export interface OperationCodeResponse {
    operationCodes: OperationCode[];
    accounts: GLAccount[];
    whereUsed: RoutingDetail[];
}
