import {SortableTableField, SorterProps} from "chums-ducks";
import {ReactElement} from "react";

export interface ListState {
    list: any[] | object,
    selected: any,
    loading: boolean,
    loaded: boolean,
    filter: string,
    wcFilter: string,
    filterInactive: boolean,
}

export const defaultListState:ListState = {
    list: [],
    selected: null,
    loading: false,
    loaded: false,
    filter: '',
    wcFilter: '',
    filterInactive: true,
}

export interface ActionInterfacePayload {
    list?: any[] | object,
    filter?: string,
    error?: Error,
    context?: string,
}



export type BillType = 'S'|'K'|'I'|'P'|'E'|'M';

export type BillTypeDescriptions = {
    [key in BillType]: string;
};
export const BillTypeDesc:BillTypeDescriptions = {
    S: 'Standard',
    K: 'Kit',
    I: 'Inactive',
    P: 'Phantom',
    E: 'Engineering',
    M: 'MRP',
}

export interface BillHeader {
    BillNo: string,
    Revision: string,
    BillType: BillType,
    BillDesc1: string,
    BillDesc2: string,
    DateLastUsed: string,
    RoutingNo: string,
    BillHasOptions: 'Y'|'N',
    DateUpdated: string,
    updatedByUser: string,
}

export interface BillHeaderList {
    [key:string]: BillHeader
}

export interface BillOptionHeader {
    BillNo: string,
    Revision: string,
    BillOptionCategory: string,
    BillOption: string,
    OptionDesc1: string,
    OptionDesc2: string|null,
    DateLastUsed: string,
    RoutingNo: string,
    WorkOrderStepNo: string,
    OptionPrice: number,
    DateUpdated: string,
    updatedByUser: string,
}

export interface BillOptionHeaderList {
    [key:string]: BillOptionHeader
}

export type BillHeaderField = keyof BillHeader;
export type BillOptionHeaderField = keyof BillOptionHeader;
export interface BillHeaderTableField extends SortableTableField {
    field: BillHeaderField,
}
export interface BillOptionHeaderTableField extends SortableTableField {
    field: BillOptionHeaderField,
}

export interface DLTiming {
    id: number,
    idSteps: number,
    efficiency: number,
    timingDate: string,
    avgTiming: number,
    standardAllowedMinutes: number,
    quantityPerTiming: number,
    notes: string|null,
    entries: number[],
    timestamp: string,
}

export interface DLTimingTableField extends SortableTableField {
    field: keyof DLTiming,
}

export interface DLBasicStep {
    id: number,
    stepCode: string,
    description: string,
    machine: string,
    workCenter: string,
    standardAllowedMinutes: number,
    fixedCosts: number,
    stepCost: number,
    active: boolean,
}

export interface DLStep extends DLBasicStep {
    instructions?: string,
    idCurrentTiming: number|null,
    notes: string|null,
    timestamp: string,
    averageHourlyRate: number,
    laborCost: number,
    timings?: DLTiming[],
}

export interface DLTimingResponse {
    timings: DLTiming[];
    step: DLStep;
}

export interface DLStepField {
    field: keyof DLStep,
}
export interface DLSteps {
    [key: number]: DLBasicStep,
}

export interface DLStepTableField extends SortableTableField {
    field: keyof DLBasicStep,
}

export interface DLStepSorterProps extends SorterProps {
    field: keyof DLBasicStep,
}


export interface DLCode {
    id: number,
    dlCode: string,
    workCenter: string,
    operationCode: string,
    active: boolean,
    description: string,
    standardAllowedMinutes: number,
    laborBudget: number,
    fixedCosts: number,
    directLaborCost: number,
    StdRatePiece: number,
    timestamp: string,
    changed?: boolean,
}

export interface DLCodeList {
    [key:number]: DLCode,
}

export interface DLCodeStep extends DLBasicStep {
    dlCodeId: number,
    dlCode: string,
    stepOrder: number,
    stepId: number,
}

export interface DLStepTotal {
    standardAllowedMinutes: number,
    fixedCosts: number,
    stepCost: number,
}

export interface DLCodeSteps {
    [key:number]: DLCodeStep,
}

export type DLCodeField = keyof DLCode;
export type DLCodeStepField = keyof DLCodeStep;


export interface DLCodeTableField extends SortableTableField {
    field: DLCodeField,
}

export interface DLStepCodeTableField extends SortableTableField {
    field: DLCodeStepField,
}

export interface GLAccount {
    AccountKey: string,
    Account: string,
    AccountDesc: string,
}

export interface GLAccountList {
    [key: string]: GLAccount,
}

export interface OperationCodeKey {
    WorkCenter: string,
    OperationCode: string,
}
export interface OperationCodeSearchKey {
    workCenter: string,
    operationCode: string,
}

export interface OperationCode extends OperationCodeKey {
    OperationDescription: string,
    StdRatePiece: number,
    PlannedPieceCostDivisor: number,
    WipDirectAcct: string,
    WipFixOverhdAcct: string,
    WipVariableOvhdAcct: string,
    AppliedDirectAcct: string,
    AppliedFixedOvhdAcct: string,
    FixedOvhdPercentOfCost: number,
}

export interface OperationCodeList {
    [key: string]: OperationCode,
}

export type OperationCodeField = keyof OperationCode;



export interface OperationCodeTableField extends SortableTableField {
    field: OperationCodeField
}

export interface RoutingResponse {
    routingHeader:RoutingHeader[];
    routingDetail:RoutingDetail[];
    whereUsed:BillHeader[];
    whereUsedOption:BillOptionHeader[];
}


export interface RoutingHeader {
    RoutingNo: string,
    StepDescription: string,
    StandardRateTotal: number,
    BillStatus: boolean,
    ItemStatus: boolean,
}

export interface RoutingHeaderList {
    [key: string]: RoutingHeader,
}

export interface RoutingDetail {
    RoutingNo: string,
    StepNo: string,
    StepDescription: string,
    WorkCenter: string,
    OperationCode: string,
    ParentQtyFactor: number,
    OperationDescription: string,
    StdRatePiece: number,
    PlannedPieceCostDivisor: number,
}

export interface RoutingDetailList {
    [key:string]: RoutingDetail;
}

export type RoutingHeaderField = keyof RoutingHeader;
export type RoutingDetailField = keyof RoutingDetail;

export interface RoutingHeaderTableField extends SortableTableField {
    field: RoutingHeaderField,
    render?: (row: RoutingHeader) => ReactElement | Element | string,
}

export interface RoutingDetailTableField extends SortableTableField {
    field: RoutingDetailField,
}

export interface WorkCenter {
    Company: string,
    WorkCenterCode: string,
    Description: string,
    CommentLine1: string,
    CommentLine2: string,
    ChrgAtEmpRate: boolean,
    OutsideProcessing: boolean,
    isStandardWC: boolean,
    AverageHourlyRate: number|null,
    changed?: boolean,
}

export interface WorkCenterList {
    [key:string]: WorkCenter
}
export type WorkCenterField = keyof WorkCenter;
