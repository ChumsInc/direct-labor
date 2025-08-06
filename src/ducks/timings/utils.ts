import type {SortProps, StepTiming} from "chums-types";
import type {TimeValue} from "./types";
import Decimal from "decimal.js";

export const timingsSorter = (sort: SortProps<StepTiming>) => (a: StepTiming, b: StepTiming) => {
    const sortMod = sort.ascending ? 1 : -1;
    switch (sort.field) {
        case 'timingDate':
        case 'notes':
            return (
                (a[sort.field] ?? '') === (b[sort.field] ?? '')
                    ? (a.id - b.id)
                    : ((a[sort.field] ?? '') > (b[sort.field] ?? '') ? 1 : -1)
            ) * sortMod;
        case 'id':
        default:
            return (a.id - b.id) * sortMod;
    }
}

export const isTimeValue = (value: string | number | null | TimeValue | unknown): value is TimeValue => {
    return value !== null
        && !['number', 'string', 'undefined'].includes(typeof value)
        && (value as TimeValue).minutes !== undefined;
}

export const numberToTime = (value: string | number | null | TimeValue | TimeEntry): TimeValue => {
    if (value instanceof TimeEntry) {
        return value.valueOf();
    }
    if (isTimeValue(value)) {
        if (value.minutes % 1 > 0) {
            // return numberToTime(value.minutes);
        }
        return new TimeEntry(value).toTimeValue();
    }

    const minutes = new Decimal(value ?? 0).floor().toNumber();
    const seconds = new Decimal(value ?? 0).sub(minutes).times(60).toDecimalPlaces(0).toNumber();


    return {
        value: new Decimal(value ?? 0).toDecimalPlaces(4).toNumber(),
        minutes: minutes,
        seconds: seconds
    }
}

export const timeToNumber = (time: TimeValue | string | number | null): number => {
    if (!isTimeValue(time)) {
        return new Decimal(time ?? 0).toNumber();
    }
    if (time.minutes % 1 > 0) {
        return time.minutes;
    }
    return new Decimal(time.minutes)
        .times(60)
        .add(time.seconds ?? 0)
        .div(60)
        .toDecimalPlaces(4).toNumber();
}

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


export const dlStepTimingSorter = (sort: SortProps<StepTiming>) => (a: StepTiming, b: StepTiming): number => {
    const sortMod = sort.ascending ? 1 : -1;
    switch (sort.field) {
        case 'timingDate':
            return (new Date(a.timingDate).valueOf() - new Date(b.timingDate).valueOf() || a.id - b.id) * sortMod;
        default:
            return (a.id - b.id) * sortMod;
    }
};


export class TimeEntry {
    #value: number = 0;
    #minutes: number = 0;
    #seconds: number = 0;

    constructor(value?: TimeEntry | TimeValue | string | number | null) {
        this.setValue(value ?? 0);
    }

    static numberToTime(value: number): TimeValue {
        const entry = new TimeEntry(value);
        return entry.toTimeValue()
    }

    static toNumber(value: TimeValue | TimeEntry | number | string) {
        const entry = new TimeEntry(value);
        return entry.#value;
    }

    static timeToNumber(time: TimeValue): number {
        return new Decimal(time.seconds).div(60).add(time.minutes).toDecimalPlaces(4).toNumber()
    }

    setValue(value: TimeEntry | TimeValue | number | string | null) {
        if (value instanceof TimeEntry) {
            this.#value = value.#value;
            this.#minutes = value.#minutes;
            this.#seconds = value.#seconds;
            return;
        }

        if (isTimeValue(value)) {
            this.#value = new Decimal(value.value).toDecimalPlaces(4).toNumber();
            if (value.minutes % 1 > 0) {
                this.#minutes = value.minutes;
                this.#seconds = new Decimal(value.minutes).mod(1).times(60).toDecimalPlaces(0).toNumber();
            } else {
                this.#minutes = value.minutes;
                this.#seconds = value.seconds;
            }
            return
        }

        this.#value = new Decimal(value ?? 0).toDecimalPlaces(4).toNumber();
        this.#minutes = new Decimal(this.#value).floor().toNumber();
        this.#seconds = new Decimal(this.#value).sub(this.#minutes).times(60).toNumber();
    }

    toTimeValue(): TimeValue {
        return {
            value: this.#value,
            minutes: this.#minutes,
            seconds: this.#seconds
        }
    }

    valueOf(): TimeValue {
        return this.toTimeValue();
    }

    setMinutes(value: number) {
        this.#minutes = value;
        if (value % 1 > 0) {
            this.#seconds = new Decimal(value).mod(1).times(60).toDecimalPlaces(0).toNumber();
        }
        this.#value = TimeEntry.timeToNumber(this.valueOf());
    }

    setSeconds(value: number) {
        this.#seconds = value;
        this.#value = TimeEntry.timeToNumber(this.valueOf());
    }
}
