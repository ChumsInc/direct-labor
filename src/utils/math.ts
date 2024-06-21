import Decimal from "decimal.js";
import numeral from "numeral";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const regexpMinSec = /(\d*):(\d+)/;

export const sumMinutes = (...params: (number | string)[]): number => Decimal.sum(...params.map(t => toMinutes(t))).toNumber();

export const averageMinutes = (params: (string | number)[]): string => params.length === 0
    ? new Decimal(0).toString()
    : Decimal.sum(...params.map(t => toMinutes(t))).div(params.length).toString()

const toMinutes = (value: string | number) => {
    if (typeof value === 'string' && regexpMinSec.test(value)) {
        const [_, min, sec] = regexpMinSec.exec(value) ?? []
        return new Decimal(dayjs.duration({
            minutes: +min ?? 0,
            seconds: +sec ?? 0
        }).asMilliseconds()).div(1000).toDecimalPlaces(4).toNumber();
    }
    return new Decimal(value).toDecimalPlaces(4).toNumber();
}

export const calcStandardAllowedMinutes = (timings: (string | number)[], qtyPerTiming: number | string = 1, efficiency: number | string = 1): string => {
    if (!timings.length || !qtyPerTiming || !efficiency) {
        return '0';
    }
    return Decimal.sum(...timings.map(t => toMinutes(t))).div(timings.length).div(qtyPerTiming ?? 1).times(efficiency ?? 1).toString();
}

export const unitsPerHour = (standardAllowedMinutes: number | string | Decimal): string => {
    return new Decimal(standardAllowedMinutes).eq(0)
        ? '0'
        : numeral(new Decimal(60).div(standardAllowedMinutes)).format('0,0.0')
}
