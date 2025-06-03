import React, {ChangeEvent, useId} from "react";
import {useSelector} from "react-redux";
import {loadRoutings, setSearch, toggleShowInactive} from "./actions";
import {selectSearch, selectShowInactive,} from './selectors';
import {FormCheck} from "react-bootstrap";
import SearchInput from "@/components/common/SearchInput";
import {useAppDispatch} from "../../app/configureStore";
import AppErrorBoundary from "@/components/AppErrorBoundary";


const RoutingFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const filter = useSelector(selectSearch);
    const showInactive = useSelector(selectShowInactive);
    const idShowInactive = useId();

    const onChange = (value: string) => {
        dispatch(setSearch(value));
    }

    const onToggleShowInactive = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked));

    const onLoad = () => {
        dispatch(loadRoutings());
    }

    return (
        <AppErrorBoundary>
            <div className="row g-3 align-items-baseline mb-3">
                <div className="col">
                    <SearchInput value={filter} onChange={onChange} placeholder="Filter Routings"/>
                </div>
                <div className="col-auto">
                    <FormCheck label={"Show Inactive"} id={idShowInactive}
                               checked={showInactive} onChange={onToggleShowInactive}
                               type="checkbox"/>
                </div>
                <div className="col-auto">
                    <button type="button" onClick={onLoad} className="btn btn-primary">
                        Load Routings
                    </button>
                </div>
            </div>
        </AppErrorBoundary>
    )
}

export default RoutingFilter;
