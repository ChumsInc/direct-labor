import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {loadRoutings, setSearch, toggleShowInactive} from "./actions";
import {selectSearch, selectShowInactive,} from './selectors';
import {FormCheck} from "chums-components";
import SearchInput from "../../components/SearchInput";
import {useAppDispatch} from "../../app/configureStore";
import ErrorBoundary from "../../components/ErrorBoundary";


const RoutingFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const filter = useSelector(selectSearch);
    const showInactive = useSelector(selectShowInactive);

    const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearch(ev.target.value));
    }

    const onToggleShowInactive = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked));

    const onLoad = () => {
        dispatch(loadRoutings());
    }

    return (
        <ErrorBoundary>
            <div className="row g-3 align-items-baseline mb-3">
                <div className="col">
                    <SearchInput value={filter} onChange={onChange} placeholder="Filter Routings"/>
                </div>
                <div className="col-auto">
                    <FormCheck label={"Show Inactive"} checked={showInactive} onChange={onToggleShowInactive}
                               type="checkbox"/>
                </div>
                <div className="col-auto">
                    <button type="button" onClick={onLoad} className="btn btn-primary" >
                        Load Routings
                    </button>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default RoutingFilter;
