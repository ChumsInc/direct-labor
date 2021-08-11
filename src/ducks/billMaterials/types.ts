import {SortableTableField, SorterProps} from "chums-ducks";

export type BillType = 'S'|'K'|'I'|'P'|'E'|'M';

export type BillTypeDescriptions = {
    [key in BillType]: string;
};
export const BillTypeDesc:BillTypeDescriptions = {
    S: 'Standard',
    K: 'Kit',
    I: 'Inactive',
    P: 'Phantom',
    E: 'Engineering',
    M: 'MRP',
}

export interface BillHeader {
    BillNo: string,
    Revision: string,
    BillType: BillType,
    BillDesc1: string,
    BillDesc2: string,
    DateLastUsed: string,
    RoutingNo: string,
    BillHasOptions: 'Y'|'N',
    DateUpdated: string,
    updatedByUser: string,
}

export interface BillHeaderList {
    [key:string]: BillHeader
}

export interface BillOptionHeader {
    BillNo: string,
    Revision: string,
    BillOptionCategory: string,
    BillOption: string,
    OptionDesc1: string,
    OptionDesc2: string|null,
    DateLastUsed: string,
    RoutingNo: string,
    WorkOrderStepNo: string,
    OptionPrice: number,
    DateUpdated: string,
    updatedByUser: string,
}

export interface BillOptionHeaderList {
    [key:string]: BillOptionHeader
}

export type BillHeaderField = keyof BillHeader;
export type BillOptionHeaderField = keyof BillOptionHeader;

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

export interface BillHeaderTableField extends SortableTableField {
    field: BillHeaderField,
}
export interface BillOptionHeaderTableField extends SortableTableField {
    field: BillOptionHeaderField,
}

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
