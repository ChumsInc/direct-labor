import {StepTiming} from "chums-types";


export const newTiming: StepTiming = {
    id: 0,
    idSteps: 0,
    timingDate: '',
    standardAllowedMinutes: 0,
    avgTiming: 0,
    quantityPerTiming: 1,
    efficiency: 1,
    notes: '',
    entries: [],
    timestamp: '',
};


export const dlStepTimingSorter = (a: StepTiming, b: StepTiming): number => {
    return (
        (new Date(a.timingDate).valueOf() - new Date(b.timingDate).valueOf())
        || (a.id > b.id ? 1 : -1)
    ) * -1;
};
