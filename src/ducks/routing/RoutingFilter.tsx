import React, {ChangeEvent, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {filterActiveSelector, filterSelector, loadingSelector} from "./index";
import {fetchRoutingsAction, filterChangedAction, toggleFilterActiveAction} from "./actions";
import {FormCheck, Input, SpinnerButton} from "chums-ducks";
import classNames from "classnames";

const RoutingFilter:React.FC = () => {
    const dispatch = useDispatch();
    const filter = useSelector(filterSelector);
    const filterActive = useSelector(filterActiveSelector);
    const loading = useSelector(loadingSelector);
    const [valid, setValid] = useState(true);

    const onChange = (ev:ChangeEvent<HTMLInputElement>) => {
        let valid = true;
        try {
            const re = new RegExp(ev.target.value, 'i');
        } catch(err) {
            valid = false;
        }
        setValid(valid);
        dispatch(filterChangedAction(ev.target.value));
    }

    const onToggleFilterActive = () => dispatch(toggleFilterActiveAction());

    return (
        <div className="row g-3">
            <div className="col-auto">
                <Input type="search" value={filter} onChange={onChange} placeholder="Filter Routings"
                       className={classNames({'is-invalid': !valid})}/>
            </div>
            <div className="col-auto">
                <FormCheck label={"Hide Inactive"} checked={filterActive} onClick={onToggleFilterActive} type="checkbox" />
            </div>
            <div className="col-auto">
                <SpinnerButton type="button" spinning={loading} size="sm"
                        onClick={() => dispatch(fetchRoutingsAction())}>
                    Load Routings
                </SpinnerButton>
            </div>
        </div>
    )
}

export default RoutingFilter;
