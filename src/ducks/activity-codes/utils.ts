import type {ActivityCode, SortProps} from "chums-types";
import Decimal from "decimal.js";
import {generatePath} from "react-router";

export const activityCodeKey = (ac: Pick<ActivityCode, 'WorkCenter' | 'ActivityCode'>) => `${ac.WorkCenter}:${ac.ActivityCode}`;

export const activityCodeKeyDiff = (a: ActivityCode, b: ActivityCode) => activityCodeKey(a) > activityCodeKey(b) ? 1 : -1;

export const activityCodeSorter = ({
                                       field,
                                       ascending
                                   }: SortProps<ActivityCode>) => (a: ActivityCode, b: ActivityCode) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'FixedOverheadAmt':
        case 'StandardCostPerHour':
        case 'StepAvgCost':
            return (
                new Decimal(a[field] ?? 0).eq(b[field] ?? 0)
                    ? activityCodeKeyDiff(a, b)
                    : (new Decimal(a[field] ?? 0).gt(b[field] ?? 0) ? 1 : -1)
            ) * sortMod;
        case 'ActivityCode':
        case 'WorkCenter':
        case 'ActivityClass':
        case 'SchedulingMethod':
        case 'WorkedDepartmentNo':
        case 'created':
        case 'updated':
            return (
                a[field] === b[field]
                    ? activityCodeKeyDiff(a, b)
                    : (a[field] > b[field] ? 1 : -1)
            ) * sortMod;
        case 'ActivityDesc':
            return (
                (a[field] ?? '').toLocaleLowerCase() === (b[field] ?? '').toLocaleLowerCase()
                    ? activityCodeKeyDiff(a, b)
                    : ((a[field] ?? '').toLocaleLowerCase() > (b[field] ?? '').toLocaleLowerCase() ? 1 : -1)
            ) * sortMod;
        default:
            return activityCodeKeyDiff(a, b) * sortMod;
    }
}


export const activityCodePath = (arg: Pick<ActivityCode, 'WorkCenter' | 'ActivityCode'>) => {
    return generatePath('/activity-codes/:workCenter/:activityCode', {
        workCenter: arg.WorkCenter,
        activityCode: arg.ActivityCode,
    })
}
