import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectVersion} from "./selectors";
import {loadVersion} from "./actions";


const VersionInfo = () => {
    const dispatch = useAppDispatch();
    const version = useAppSelector(selectVersion);

    useEffect(() => {
        dispatch(loadVersion())
    }, []);

    return (<div className="text-secondary mt-5">Version: {version}</div>);
}

export default VersionInfo;
