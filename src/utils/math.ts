export const sum = (...params:number[]):number => params.reduce((a, b) => a + b, 0);

export const average = (...params:number[]) => params.length === 0 ? 0 : sum(...params) / params.length;

export const calcStandardAllowedMinutes = (timings:number[], qtyPerTiming:number = 1, efficiency:number = 1):number => {
    if (!timings.length || !qtyPerTiming || !efficiency) {
        return 0;
    }
    return (average(...timings) / qtyPerTiming) * efficiency;
}

export const stdDev = (...params:number[]):number => {
    if (params.length === 0) {
        return 0;
    }
    const mean = average(...params);
    return Math.sqrt(
        params
            .reduce((acc:number[], val:number) => acc.concat((val - mean) ** 2), [])
            .reduce((acc, val) => acc + val, 0)
        / params.length
    )
}
