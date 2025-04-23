import React, {ChangeEvent, useEffect} from 'react';
import {FormSelect, FormSelectProps} from "react-bootstrap";
import {ActivityCode} from "chums-types";
import {useAppSelector} from "@/app/configureStore";
import {selectActivityCodes} from "@/ducks/activity-codes/selectors";
import {activityCodeSorter} from "@/ducks/activity-codes/utils";


const activityCodeList = (codes:ActivityCode[], workCenter:string):ActivityCode[] => {
    return codes
        .filter(ac => !workCenter || ac.WorkCenter === workCenter)
        .sort(activityCodeSorter({field: 'ActivityCode', ascending: true}))
}

const workCenterList = (codes:ActivityCode[]):string[] => {
    return Array.from(new Set(codes.map(ac => ac.WorkCenter))).sort();
}

const activityCodeKey = (ac:ActivityCode) => `${ac.WorkCenter}/${ac.ActivityCode}`;

export interface ActivityCodeSelectProps extends Omit<FormSelectProps, 'onChange'> {
    workCenter: string;
    onChange: (value: ActivityCode|null) => void;
}
export default function ActivityCodeSelect({workCenter, value, onChange, ...rest}: ActivityCodeSelectProps) {
    const activityCodes = useAppSelector(selectActivityCodes);
    const [values, setValues] = React.useState<ActivityCode[]>(activityCodeList(activityCodes, workCenter));
    const [workCenters, setWorkCenters] = React.useState<string[]>(workCenterList(activityCodes));

    useEffect(() => {
        const list = activityCodeList(activityCodes, workCenter);
        setValues(list);
        setWorkCenters(workCenterList(list));
    }, [activityCodes, workCenter]);

    const changeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        const value = values.find(ac => ac.WorkCenter === workCenter && ac.ActivityCode === ev.target.value);
        onChange(value ?? null);
    }

    return (
        <FormSelect value={value} onChange={changeHandler} {...rest}>
            <option value="">Select Activity Code</option>
            {workCenters.map(wc => (<optgroup key={wc} label={wc}>
                {values
                    .filter(ac => ac.WorkCenter === wc)
                    .map(ac => (<option key={activityCodeKey(ac)} value={ac.ActivityCode}>{ac.ActivityCode} - {ac.ActivityDesc}</option>))}
            </optgroup>))}
        </FormSelect>
    )
}
