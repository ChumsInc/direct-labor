import {SortProps, WorkCenter} from "chums-types";
import Decimal from "decimal.js";


export const workCenterKey = (wc: WorkCenter) => wc.workCenter;

const workCenterKeyCompare = (a:WorkCenter, b:WorkCenter) => workCenterKey(a) > workCenterKey(b) ? 1 : -1;

export const workCenterSorter = ({field, ascending}: SortProps<WorkCenter>) =>
    (a: WorkCenter, b: WorkCenter): number => {
        const sortMod = ascending ? 1 : -1;
        switch (field) {
            case 'averageHourlyRate':
            case 'efficiencyPercent':
                return (
                    new Decimal(a[field] ?? 0).eq(b[field] ?? 0)
                        ? workCenterKeyCompare(a, b)
                        : (new Decimal(a[field] ?? 0).gt(b[field] ?? 0) ? 1 : -1)
                ) * sortMod;
            case "isStandardWC":
                return (
                    a.isStandardWC === b.isStandardWC
                        ? workCenterKeyCompare(a, b)
                        : (+a.isStandardWC - +b.isStandardWC)
                ) * sortMod;
            default:
                return (
                    (a[field] ?? '') === (b[field] ?? '')
                        ? workCenterKeyCompare(a, b)
                        : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1)
                ) * sortMod;
        }
    };
