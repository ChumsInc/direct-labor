import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectTemplateListStatus, selectTemplateListSearch} from "./selectors";
import {loadTemplateList, setTemplatesSearch} from "./actions";

const TemplatesFilter = () => {
    const dispatch = useAppDispatch();
    const search = useAppSelector(selectTemplateListSearch);
    const status = useAppSelector(selectTemplateListStatus);
    const id = useId();

    const reloadHandler = () => {
        dispatch(loadTemplateList())
    }

    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(setTemplatesSearch(ev.target.value));
    }
    return (
        <div className="row g-3 mb-3">
            <div className="col">
                <div className="input-group">
                    <label className="input-group-text" htmlFor={id} >Search</label>
                    <input type="search" className="form-control" value={search} onChange={changeHandler} id={id}/>
                </div>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-outline-primary" onClick={reloadHandler} disabled={status !== 'idle'}>
                    Reload
                </button>
            </div>
        </div>
    )
}

export default TemplatesFilter;
