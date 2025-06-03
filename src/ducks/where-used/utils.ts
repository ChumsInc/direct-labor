import {TemplateBillHeader, TemplateBillOption, TemplateBillOptionHeader} from "@/ducks/types";
import {SortProps} from "chums-types";

type SortFunction<T = unknown> = (sort: SortProps<T>) => (a:T, b:T) => number;

export const templateBillHeaderKey = (arg:TemplateBillHeader):string => {
    return `${arg.BillNo}/${arg.Revision}`;
}

export const billHeaderSorter:SortFunction<TemplateBillHeader> = ({field, ascending}) => (a, b) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'BillDesc1':
        case 'BillDesc2':
        case 'ProductType':
        case 'DateLastUsed':
            return (
                (a[field] ?? '').localeCompare(b[field] ?? '') === 0
                ? templateBillHeaderKey(a).localeCompare(templateBillHeaderKey(b))
                : (a[field] ?? '').localeCompare(b[field] ?? '')
            ) * sortMod;
        case 'BillNo':
        case 'Revision':
        default:
            return templateBillHeaderKey(a).localeCompare(templateBillHeaderKey(b)) * sortMod;
    }
}

export const billOptionHeaderSorter:SortFunction<TemplateBillOptionHeader> = ({field, ascending}) => (a, b) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'ProductType':
        case 'DateLastUsed':
            return (
                (a[field] ?? '').localeCompare(b[field] ?? '') === 0
                ? a.BillNo.localeCompare(b.BillNo)
                : (a[field] ?? '').localeCompare(b[field] ?? '')
            ) * sortMod;
        case 'BillNo':
        default:
            return (a.BillNo.localeCompare(b.BillNo)) * sortMod;
    }
}

export const billOptionKey = (arg:TemplateBillOption) => {
    return `${arg.BillOptionCategory}/${arg.BillOption}`
}
