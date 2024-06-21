import {DLCode, DLCodeStep} from "chums-types";

export interface DLCodeResponse {
    dlCode: DLCode,
    steps: DLCodeStep[],
}

export interface AddDLStepArg {
    id: number,
    stepId: number,
}
