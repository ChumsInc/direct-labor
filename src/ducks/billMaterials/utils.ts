import {BillHeader, BillOptionHeader} from "chums-types";
import {SortProps} from "chums-types";
import dayjs from "dayjs";
import Decimal from "decimal.js";


export const billHeaderKey = (header: BillHeader) => [header.BillNo, header.Revision].join(':');
export const billOptionHeaderKey = (header: BillOptionHeader) => [header.BillNo, header.Revision, header.BillOptionCategory, header.BillOption].join(':');

export const defaultBillSort: SortProps<BillHeader> = {field: "BillNo", ascending: true};
export const defaultBillOptionSort: SortProps<BillOptionHeader> = {field: "BillNo", ascending: true};


export const billHeaderSorter = ({field, ascending}: SortProps<BillHeader>) =>
    (a: BillHeader, b: BillHeader) => {
        const sortMod = ascending ? 1 : -1;
        switch (field) {
        case 'BillNo':
        case 'Revision':
        case 'BillType':
        case 'updatedByUser':
            return (a[field] === b[field]
                    ? (billHeaderKey(a) > billHeaderKey(b) ? 1 : -1)
                    : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)
            ) * sortMod;
        case 'DateUpdated':
        case 'DateLastUsed':
            return (dayjs(a[field]).valueOf() === dayjs(b[field]).valueOf()
                    ? (billHeaderKey(a) > billHeaderKey(b) ? 1 : -1)
                    : dayjs(a[field]).valueOf() - dayjs(b[field]).valueOf()
            ) * sortMod
        default:
            return (billHeaderKey(a) > billHeaderKey(b) ? 1 : -1) * sortMod;
        }
    };

export const billOptionHeaderSorter = ({field, ascending}: SortProps<BillOptionHeader>) =>
    (a: BillOptionHeader, b: BillOptionHeader) => {
        const sortMod = ascending ? 1 : -1;
        switch (field) {
        case 'BillNo':
        case 'Revision':
        case 'BillOption':
        case 'BillOptionCategory':
        case 'OptionDesc1':
        case 'WorkOrderStepNo':
        case 'updatedByUser':
            return (a[field] === b[field]
                    ? (billOptionHeaderKey(a) > billOptionHeaderKey(b) ? 1 : -1)
                    : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)
            ) * sortMod;
        case "DateUpdated":
        case 'DateLastUsed':
            return (dayjs(a[field]).valueOf() === dayjs(b[field]).valueOf()
                    ? (billOptionHeaderKey(a) > billOptionHeaderKey(b) ? 1 : -1)
                    : dayjs(a[field]).valueOf() - dayjs(b[field]).valueOf()
            ) * sortMod
        case 'OptionPrice':
            return (new Decimal(a[field]).eq(b[field])
                    ? (billOptionHeaderKey(a) > billOptionHeaderKey(b) ? 1 : -1)
                    : (new Decimal(a[field]).gt(b[field]) ? 1 : -1)
            ) * sortMod
        default:
            return (billOptionHeaderKey(a) > billOptionHeaderKey(b) ? 1 : -1) * sortMod;
        }
    };
