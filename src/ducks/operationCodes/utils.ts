import {OperationCode, OperationCodeKey} from "chums-types";
import {SortProps} from "chums-types";

export const operationCodeKey = (oc?: OperationCodeKey | null) => !!oc ? [oc.WorkCenter, oc.OperationCode].join(':') : '';
export const operationCodeSearchKey = ({
                                           workCenter,
                                           operationCode
                                       }: { workCenter: string, operationCode: string }) => [workCenter, operationCode].join(':');

export const operationCodeDefaultSort: SortProps<OperationCode> = {field: 'WorkCenter', ascending: true};

export const operationCodeSorter = ({field, ascending}: SortProps<OperationCode>) =>
    (a: OperationCode, b: OperationCode): number => {
        return (
            a[field] === b[field]
                ? (operationCodeKey(a) > operationCodeKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };
