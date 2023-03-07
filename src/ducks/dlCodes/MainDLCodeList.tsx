import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {listSelector, loadedSelector, loadingSelector, selectedHeaderSelector} from "./selectors";
import {loadDLCodeAction, loadDLCodesAction} from "./actions";
import {addPageSetAction, sortableTableSelector, tableAddedAction} from "chums-ducks";
import {defaultDLCodeSort, DLCodeSorterProps} from "./types";
import {DLCode} from "../types";
import DLCodeList from "./DLCodeList";
import {useHistory} from "react-router-dom";
import {dlCodePath} from "../../routerPaths";
import {useAppDispatch} from "../../app/configureStore";

export interface MainDLCodeListProps {
    tableKey: string,
}

const MainDLCodeList: React.FC<MainDLCodeListProps> = ({tableKey}) => {
    const history = useHistory();
    const dispatch = useAppDispatch();
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
        history.push(dlCodePath(code.id));
        dispatch(loadDLCodeAction(code));
    }

    return (
        <DLCodeList tableKey={tableKey} list={list} selected={selected} onSelectDLCode={onSelectDLCode}/>
    )
}

export default MainDLCodeList;
