import type {DLBasicStep, DLStep, SortProps, StepTiming} from "chums-types";

export const newDLStep: DLStep = {
    id: 0,
    stepCode: '',
    description: '',
    workCenter: '',
    machine: '',
    active: true,
    standardAllowedMinutes: 0,
    fixedCosts: 0,
    stepCost: 0,
    notes: '',
    instructions: '',
    idCurrentTiming: null,
    averageHourlyRate: 0,
    laborCost: 0,
    timings: [],
    lastUpdated: null,
    timestamp: ''
}


export const dlStepsDefaultSort: SortProps<DLStep> = {
    field: 'id',
    ascending: true,
}


export const dlStepKey = (dl: DLStep | DLBasicStep) => dl.id;

export const dlStepSorter = ({field, ascending}: SortProps<DLStep>) =>
    (a: DLStep, b: DLStep): number => {
        return (
            a[field] === b[field]
                ? (dlStepKey(a) > dlStepKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };

export const dlStepTimingSorter = (a: StepTiming, b: StepTiming): number => {
    return (new Date(a.timingDate).valueOf() - new Date(b.timingDate).valueOf() || (a.id > b.id ? 1 : -1)) * -1;
};
