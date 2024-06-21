import {DLCode, DLStep} from "chums-types";

export interface LoadDLStepsResponse {
    steps: DLStep[];
    machines: string[];
}

export interface LoadDLStepResponse {
    step: DLStep | null;
    whereUsed: DLCode[];
}
