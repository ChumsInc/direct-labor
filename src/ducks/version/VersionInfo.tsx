import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {loadVersion, selectVersion} from "./index";

const VersionInfo = () => {
    const dispatch = useAppDispatch();
    const version = useAppSelector(selectVersion);

    useEffect(() => {
        dispatch(loadVersion())
    }, []);
    return (<div className="text-muted mt-5">Version: {version}</div>);
}

export default VersionInfo;
