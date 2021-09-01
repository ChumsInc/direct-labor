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
