import type {GLAccount, OperationCode, RoutingDetail} from "chums-types";

export interface OperationCodeResponse {
    operationCodes: OperationCode[];
    accounts: GLAccount[];
    whereUsed: RoutingDetail[];
}
