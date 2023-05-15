import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {loadRoutings, selectLoading, selectSearch, selectShowInactive, setSearch, toggleShowInactive} from "./index";
import {FormCheck, SpinnerButton} from "chums-components";
import SearchInput from "../../components/SearchInput";
import {useAppDispatch} from "../../app/configureStore";

const RoutingFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const filter = useSelector(selectSearch);
    const filterActive = useSelector(selectShowInactive);
    const loading = useSelector(selectLoading);

    const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearch(ev.target.value));
    }

    const onToggleFilterActive = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked));

    return (
        <div className="row g-3">
            <div className="col-auto">
                <SearchInput value={filter} onChange={onChange} placeholder="Filter Routings" bsSize="sm"/>
            </div>
            <div className="col-auto">
                <FormCheck label={"Hide Inactive"} checked={filterActive} onChange={onToggleFilterActive}
                           type="checkbox"/>
            </div>
            <div className="col-auto">
                <SpinnerButton type="button" spinning={loading} size="sm"
                               onClick={() => dispatch(loadRoutings())}>
                    Load Routings
                </SpinnerButton>
            </div>
        </div>
    )
}

export default RoutingFilter;
