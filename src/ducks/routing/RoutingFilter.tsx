import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {filterActiveSelector, filterSelector, loadingSelector} from "./index";
import {fetchRoutingsAction, filterChangedAction, toggleFilterActiveAction} from "./actions";
import {FormCheck, SpinnerButton} from "chums-ducks";
import SearchInput from "../../components/SearchInput";
import {useAppDispatch} from "../../app/configureStore";

const RoutingFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const filter = useSelector(filterSelector);
    const filterActive = useSelector(filterActiveSelector);
    const loading = useSelector(loadingSelector);

    const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(filterChangedAction(ev.target.value));
    }

    const onToggleFilterActive = () => dispatch(toggleFilterActiveAction());

    return (
        <div className="row g-3">
            <div className="col-auto">
                <SearchInput value={filter} onChange={onChange} placeholder="Filter Routings" bsSize="sm"/>
            </div>
            <div className="col-auto">
                <FormCheck label={"Hide Inactive"} checked={filterActive} onClick={onToggleFilterActive}
                           type="checkbox"/>
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
