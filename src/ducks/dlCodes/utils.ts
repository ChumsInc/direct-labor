import {DLCodeStep, DLCodeSteps, DLStepTotal} from "../types";
import {SorterProps} from "chums-ducks";

export const dlStepList = (list:DLCodeStep[]):DLCodeSteps => {
    const steps: DLCodeSteps = {};
    list.forEach((step: DLCodeStep) => {
        steps[step.id] = step;
    });
    return steps;
}


export interface DLCodeStepSorterProps extends SorterProps {
    field: keyof DLCodeStep
}


const stepTotalInitialValue:DLStepTotal = {standardAllowedMinutes: 0, fixedCosts: 0, stepCost: 0};
export const stepTotalReducer = (steps: DLCodeStep[], ):DLStepTotal =>
    steps.reduce((previousValue, step, {}) => ({
        standardAllowedMinutes: previousValue.standardAllowedMinutes + step.standardAllowedMinutes,
        fixedCosts: previousValue.fixedCosts + step.fixedCosts,
        stepCost: previousValue.stepCost + step.stepCost,
    }), stepTotalInitialValue);

export const dlCodeStepSorter = (a: DLCodeStep, b: DLCodeStep):number => a.stepOrder - b.stepOrder;
