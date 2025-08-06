import type {SortProps, WorkTemplate, WorkTemplateStep} from "chums-types";
import Decimal from "decimal.js";
import {generatePath} from "react-router";


export const templateStepKey = (value: WorkTemplateStep) => `${value.TemplateNo}:${value.RevisionNo}:${value.StepNo}`;

export const templateStepKeyComparator = (a: WorkTemplateStep, b: WorkTemplateStep) => templateStepKey(a) > templateStepKey(b) ? 1 : -1

export const TemplateStepSorter = ({
                                       field,
                                       ascending
                                   }: SortProps<WorkTemplateStep>) =>
    (a: WorkTemplateStep, b: WorkTemplateStep) => {
        const sortMod = ascending ? 1 : -1;
        switch (field) {
            case 'TemplateNo':
            case 'TemplateDesc':
            case 'StepNo':
            case 'ActivityCode':
            case 'WorkCenter':
            case 'RevisionNo':
            case 'updated':
                return (
                    a[field] === b[field]
                        ? templateStepKeyComparator(a, b)
                        : (a[field] > b[field] ? 1 : -1)
                ) * sortMod;
            case 'BudgetLaborCost':
            case 'BudgetMaterialCost':
            case 'ScalingFactorLabor':
            case 'ScalingFactorMaterials':
                return (
                    new Decimal(a[field]).eq(b[field])
                        ? templateStepKeyComparator(a, b)
                        : (new Decimal(a[field]).sub(b[field]).toNumber())
                ) * sortMod;
            default:
                return templateStepKeyComparator(a, b) * sortMod;
        }
    }

export const templateKey = (arg: Pick<WorkTemplate, 'TemplateNo' | 'RevisionNo'>) => `${arg.TemplateNo}:${arg.RevisionNo}`
export const templateKeyComparator = (a: WorkTemplate, b: WorkTemplate): number => {
    return templateKey(a) === templateKey(b) ? 1 : -1;
}

export const isTemplateStepCount = (arg: number | WorkTemplateStep[]): arg is number => {
    return typeof arg === 'number';
}

export const templateStepCount = (arg: WorkTemplate): number => {
    return isTemplateStepCount(arg.Steps) ? arg.Steps : arg.Steps.length;
}

export const templateSorter = ({field, ascending}: SortProps<WorkTemplate>) => (a: WorkTemplate, b: WorkTemplate) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'TemplateNo':
        case 'RevisionNo':
            return (
                a[field].toUpperCase() === b[field].toUpperCase()
                    ? templateKeyComparator(a, b)
                    : (a[field].toUpperCase() > b[field].toUpperCase() ? 1 : -1)
            ) * sortMod;
        case 'TemplateDesc':
            return (
                (a[field] ?? '').toUpperCase() === (b[field] ?? '').toUpperCase()
                    ? templateKeyComparator(a, b)
                    : ((a[field] ?? '').toUpperCase() > (b[field] ?? '').toUpperCase() ? 1 : -1)
            ) * sortMod;
        case 'Steps':
            return (
                templateStepCount(a) === templateStepCount(b)
                    ? templateKeyComparator(a, b)
                    : templateStepCount(a) - templateStepCount(b)
            ) * sortMod;
        case 'TemplateCost':
            return (
                new Decimal(a[field]).eq(b[field])
                    ? templateKeyComparator(a, b)
                    : new Decimal(a[field]).sub(b[field]).toNumber()
            ) * sortMod;
        default:
            return templateKeyComparator(a, b) * sortMod;
    }
}

export const calculateStepLaborCost = (arg: Pick<WorkTemplateStep, 'ScalingMethod' | 'ScalingFactorLabor' | 'BudgetLaborCost'>): string | null => {
    switch (arg.ScalingMethod) {
        case 'Y':
            return new Decimal(arg.ScalingFactorLabor).eq(0)
                ? null
                : new Decimal(arg.BudgetLaborCost).div(arg.ScalingFactorLabor).toDecimalPlaces(4).toString();
        case 'M':
            return new Decimal(arg.BudgetLaborCost).eq(0)
                ? null
                : new Decimal(arg.ScalingFactorLabor).div(arg.BudgetLaborCost).toDecimalPlaces(4).toString();
        case 'N':
            return new Decimal(arg.BudgetLaborCost).toDecimalPlaces(4).toString();
        default:
            return null;

    }
}

export const templatePath = (arg: WorkTemplate) => {
    return generatePath('/templates/:templateNo/:revisionNo', {
        templateNo: arg.TemplateNo,
        revisionNo: arg.RevisionNo,
    })
}
