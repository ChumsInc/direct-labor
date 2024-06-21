import {DLCodeSteps, DLStepTotal} from "../types";
import {DLCode, DLCodeStep} from "chums-types";
import Decimal from "decimal.js";
import {SortProps} from "chums-components";

export const dlStepList = (list: DLCodeStep[]): DLCodeSteps => {
    const steps: DLCodeSteps = {};
    list.forEach((step: DLCodeStep) => {
        steps[step.id] = step;
    });
    return steps;
}

const stepTotalInitialValue: DLStepTotal = {standardAllowedMinutes: 0, fixedCosts: 0, stepCost: 0};

export const stepTotalReducer = (steps: DLCodeStep[],): DLStepTotal =>
    steps.reduce((previousValue, step, {}) => ({
        standardAllowedMinutes: new Decimal(previousValue.standardAllowedMinutes).add(step.standardAllowedMinutes).toNumber(),
        fixedCosts: new Decimal(previousValue.fixedCosts).add(step.fixedCosts).toNumber(),
        stepCost: new Decimal(previousValue.stepCost).add(step.stepCost).toNumber(),
    }), stepTotalInitialValue);

export const dlCodeStepSorter = (a: DLCodeStep, b: DLCodeStep): number => {
    return (a?.stepOrder ?? 0) - (b?.stepOrder ?? 0);
}

export const newDLCode: DLCode = {
    id: 0,
    dlCode: '',
    workCenter: '',
    activityCode: '',
    WOWorkCenter: '',
    WOOperationCode: '',
    operationCode: '',
    active: true,
    description: '',
    standardAllowedMinutes: 0,
    laborBudget: 0,
    fixedCosts: 0,
    directLaborCost: 0,
    StdRatePiece: 0,
    templates: [],
    timestamp: '',
}


export const defaultDLCodeSort: SortProps<DLCode> = {field: 'dlCode', ascending: true};

export const dlCodeKey = (dl: DLCode) => dl.id;


export const dlCodeSorter = ({field, ascending}: SortProps<DLCode>) =>
    (a: DLCode, b: DLCode): number => {
        return (
            a[field] === b[field]
                ? (dlCodeKey(a) > dlCodeKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };
