import {SorterProps} from "chums-ducks";
import {
    BillHeader,
    BillHeaderField,
    BillHeaderList,
    BillOptionHeader,
    BillOptionHeaderField,
    BillOptionHeaderList
} from "../types";


export const billHeaderKey = (header: BillHeader) => [header.BillNo, header.Revision].join(':');
export const billOptionHeaderKey = (header: BillOptionHeader) => [header.BillNo, header.Revision, header.BillOptionCategory, header.BillOption].join(':');



export interface BillHeaderSorterProps extends SorterProps {
    field: BillHeaderField
}
export interface BillOptionHeaderSorterProps extends SorterProps {
    field: BillOptionHeaderField
}

export const defaultBillSort: BillHeaderSorterProps = {field: "BillNo", ascending: true};
export const defaultBillOptionSort: BillHeaderSorterProps = {field: "BillNo", ascending: true};


export interface BillMaterialsState {
    headerList: BillHeaderList,
    optionHeaderList: BillOptionHeaderList,
}

export const defaultState:BillMaterialsState = {
    headerList: {},
    optionHeaderList: {},
}

export const billHeaderSorter = ({field, ascending}: BillHeaderSorterProps) =>
    (a: BillHeader, b: BillHeader) => {
        return (
            a[field] === b[field]
                ? (billHeaderKey(a) > billHeaderKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };

export const billOptionHeaderSorter = ({field, ascending}: BillOptionHeaderSorterProps) =>
    (a: BillOptionHeader, b: BillOptionHeader) => {
        return (
            a[field] === b[field]
                ? (billOptionHeaderKey(a) > billOptionHeaderKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };
