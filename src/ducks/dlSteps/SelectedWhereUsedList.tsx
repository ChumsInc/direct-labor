import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectedStepSelector, whereUsedSelector} from "./selectors";
import {addPageSetAction, sortableTableSelector, tableAddedAction} from "chums-ducks";
import {defaultDLCodeSort, DLCodeSorterProps} from "../dlCodes/types";
import DLCodeList from "../dlCodes/DLCodeList";

const tableKey = 'selected-step-where-used';

const SelectedWhereUsedList:React.FC = () => {
    const dispatch = useDispatch();
    const sortProps = useSelector(sortableTableSelector(tableKey));
    const list = useSelector(whereUsedSelector(sortProps as DLCodeSorterProps));

    useEffect(() => {
        dispatch(addPageSetAction({key: tableKey}));
        dispatch(tableAddedAction({key: tableKey,...defaultDLCodeSort}));
    }, [])

    return (
        <DLCodeList tableKey={tableKey} list={list} />
    )
}
export default SelectedWhereUsedList;
