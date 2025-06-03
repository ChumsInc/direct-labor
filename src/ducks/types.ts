import {
    ActivityCode,
    BillHeader,
    BillOptionHeader,
    BillType,
    DLBasicStep,
    DLCode,
    DLCodeStep,
    GLAccount,
    OperationCode,
    RoutingDetail,
    RoutingHeader,
    WorkCenter,
    WorkTemplateStep
} from "chums-types";

export interface ListState {
    list: any[] | object,
    selected: any,
    loading: boolean,
    loaded: boolean,
    filter: string,
    wcFilter: string,
    filterInactive: boolean,
}

export const defaultListState: ListState = {
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

export type BillTypeDescriptions = {
    [key in BillType]: string;
};

export const BillTypeDesc: BillTypeDescriptions = {
    S: 'Standard',
    K: 'Kit',
    I: 'Inactive',
    P: 'Phantom',
    E: 'Engineering',
    M: 'MRP',
}


export interface BillHeaderList {
    [key: string]: BillHeader
}

export interface BillOptionHeaderList {
    [key: string]: BillOptionHeader
}

export interface DLSteps {
    [key: number]: DLBasicStep,
}


export interface DLCodeList {
    [key: number]: DLCode,
}


export interface DLStepTotal {
    standardAllowedMinutes: number,
    fixedCosts: number,
    stepCost: number,
}

export interface DLCodeSteps {
    [key: number]: DLCodeStep,
}


export interface GLAccountList {
    [key: string]: GLAccount,
}


export interface OperationCodeList {
    [key: string]: OperationCode,
}


export interface RoutingResponse {
    routingHeader: RoutingHeader[];
    routingDetail: RoutingDetail[];
    whereUsed: BillHeader[];
    whereUsedOption: BillOptionHeader[];
}


export interface RoutingHeaderList {
    [key: string]: RoutingHeader,
}


export interface RoutingDetailList {
    [key: string]: RoutingDetail;
}

export interface WorkCenterList {
    [key: string]: WorkCenter;
}


export interface LoadActivityCodeResponse {
    activityCode: ActivityCode;
    steps: WorkTemplateStep[];
}



export interface TemplateItem {
    TemplateNo: string;
    ItemCode: string;
    ItemCodeDesc: string;
    ProductType: string;
    InactiveItem: 'Y' | 'N';
}
export interface TemplateBillHeader {
    TemplateNo: string;
    RevisionNo: string;
    BillNo: string;
    Revision: string;
    BillDesc1: string|null;
    BillDesc2: string|null;
    BillType: string;
    DateLastUsed: string|null;
    BillHasOptions: string;
    ProductType: string;
    InactiveItem: 'Y' | 'N';
    DateUpdated: string;
}

export interface TemplateBillOptionHeader {
    TemplateNo: string;
    RevisionNo: string;
    BillNo: string;
    Options: TemplateBillOption[];
    ProductType: string;
    InactiveItem: 'Y' | 'N';
    DateLastUsed: string|null;
    DateUpdated: string;
}
export interface TemplateBillOption {
    BillOptionCategory: string;
    BillOption: string;
    OptionDesc1: string;
    OptionDesc2: string;
}

export interface TemplateWhereUsedResponse {
    items: TemplateItem[];
    billHeaders: TemplateBillHeader[];
    billOptions: TemplateBillOptionHeader[];

}
