import React from 'react';
import {InputGroup} from "chums-components";
import {useAppSelector} from "../../app/configureStore";
import {selectCurrentDLSageRate} from "./selectors";

export default function DLCodeSageRate() {
    const rateProps = useAppSelector(selectCurrentDLSageRate);

    return (
        <div className="row g-3">
            <div className="col-6">
                <InputGroup>
                    <span className="input-group-text">Labor Rate</span>
                    <input type="text" value={rateProps?.averageHourlyRate ?? ''} className="form-control text-end"
                           readOnly/>
                </InputGroup>
            </div>
            <div className="col-6">
                <InputGroup>
                    <span className="input-group-text">Labor Scaling Quantity</span>
                    <input type="text" value={rateProps?.scalingFactorLabor ?? ''} className="form-control text-end"
                           readOnly/>
                </InputGroup>
            </div>
        </div>
    )
}
