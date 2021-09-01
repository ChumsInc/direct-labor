import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {listSelector, loadedSelector, loadingSelector, selectedHeaderSelector} from "./selectors";
import {loadDLCodeAction, loadDLCodesAction} from "./actions";
import {addPageSetAction, sortableTableSelector, tableAddedAction} from "chums-ducks";
import {defaultDLCodeSort, DLCodeSorterProps} from "./types";
import {DLCode} from "../types";
import DLCodeList from "./DLCodeList";

export interface MainDLCodeListProps {
    tableKey: string,
}

const MainDLCodeList: React.FC<MainDLCodeListProps> = ({tableKey}) => {
    const dispatch = useDispatch();
    const loading = useSelector(loadingSelector);
    const loaded = useSelector(loadedSelector);
    const selected = useSelector(selectedHeaderSelector)

    const sortProps = useSelector(sortableTableSelector(tableKey));
    const list = useSelector(listSelector(sortProps as DLCodeSorterProps));

    useEffect(() => {
        dispatch(addPageSetAction({key: tableKey}));
        dispatch(tableAddedAction({key: tableKey, ...defaultDLCodeSort}));
        if (!loaded && !loading) {
            dispatch(loadDLCodesAction());
        }
    }, [])

    const onSelectDLCode = (code: DLCode) => {
        dispatch(loadDLCodeAction(code));
    }

    return (
        <DLCodeList tableKey={tableKey} list={list} selected={selected} onSelectDLCode={onSelectDLCode}/>
    )
}

export default MainDLCodeList;
