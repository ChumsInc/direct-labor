import type {
    ActivityCode,
    BillHeader,
    BillOptionHeader,
    BillType,
    DLCodeStep,
    GLAccount,
    RoutingDetail,
    RoutingHeader,
    WorkCenter,
    WorkTemplateStep
} from "chums-types";


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
    BillDesc1: string | null;
    BillDesc2: string | null;
    BillType: string;
    DateLastUsed: string | null;
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
    DateLastUsed: string | null;
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
