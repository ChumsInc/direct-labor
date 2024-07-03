import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCurrentActivityCode, selectCurrentActivityCodeKey, selectCurrentActivityCodeSteps} from "./selectors";
import {useParams} from "react-router-dom";
import {setCurrentActivityCode} from "./actions";
import CurrentActivitySteps from "./CurrentActivitySteps";
import CurrentActivityDLCodes from "./CurrentActivityDLCodes";
import {FormColumn} from "chums-components";
import dayjs from "dayjs";

const CurrentActivityCode = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentActivityCode);
    const steps = useAppSelector(selectCurrentActivityCodeSteps);
    const params = useParams<"workCenter"|"activityCode">()

    useEffect(() => {
        if (params.workCenter && params.activityCode) {
            dispatch(setCurrentActivityCode({WorkCenter: params.workCenter, ActivityCode: params.activityCode}));
        }
    }, [params]);

    return (
        <div>
            <div className="card mb-5">
                <div className="card-header">
                    {current?.WorkCenter}/{current?.ActivityCode}
                </div>
                <div className="card-body">
                    <h3 className="card-title">{current?.ActivityDesc}</h3>
                    <FormColumn label="Scrap Account">
                        <div>
                            <strong className="me-3">{current?.ScrapAccount?.Account}</strong>
                            <span className="text-secondary">{current?.ScrapAccount?.AccountDesc}</span>
                        </div>
                    </FormColumn>
                    <FormColumn label="Updated">
                        {dayjs(current?.updated).isValid() && (
                            <span className="text-secondary">{dayjs(current?.updated).format('MM/DD/YYYY HH:mm')}</span>
                        )}
                    </FormColumn>
                </div>
            </div>
            <CurrentActivityDLCodes/>
            <CurrentActivitySteps/>
        </div>
    )
}

export default CurrentActivityCode
