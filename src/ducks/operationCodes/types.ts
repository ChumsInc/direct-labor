import {ActionInterface, SorterProps} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
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
export const operationCodeSearchKey = ({
                                           workCenter,
                                           operationCode
                                       }: { workCenter: string, operationCode: string }) => [workCenter, operationCode].join(':');

export const operationCodeDefaultSort: OperationCodeSorterProps = {field: 'WorkCenter', ascending: true};

export interface OperationCodeSorterProps extends SorterProps {
    field: OperationCodeField
}

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
    selected: OperationCode | null,
    whereUsed: string[],
    filterWC: string,
}

export const defaultState: OperationCodeState = {
    ...defaultListState,
    list: {},
    selected: null,
    whereUsed: [],
    filterWC: '',
}
