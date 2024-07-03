import dayjs from "dayjs";

export const inputDate = (date:Date|number|string):string => {
    const d = new Date(date);
    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0')
    ].join('/')
}

export const dateFromInputValue = (value:string):Date => {
    const date = new Date(value);
    return new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
}

export const friendlyDate = (value:string) => {
    if (!dayjs(value).isValid()) {
        return value;
    }
    const date = dayjs(value);
    const now = new Date();
    if (date.isSame(now, 'day')) {
        return date.format('HH:mm');
    }
    if (date.isSame(now, 'week')) {
        return date.format('ddd HH:mm');
    }
    if (date.isSame(now, 'year')) {
        return date.format('MM/DD');
    }
    return date.format('MM/DD/YYYY');
}
