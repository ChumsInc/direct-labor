import type {DLStep, StepTiming} from "chums-types";


export interface SaveTimingResponse {
    timing: StepTiming | null;
    timings: StepTiming[];
    step: DLStep;
}

export type StepTimingId = Pick<StepTiming, 'id' | 'idSteps'>


export interface TimingEntry {
    index: number | null;
    value: string | number | null;
}

export interface TimeValue {
    value: number;
    minutes: number;
    seconds: number;
}
