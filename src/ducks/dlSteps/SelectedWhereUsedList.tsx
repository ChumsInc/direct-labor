import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {whereUsedSelector} from "./selectors";
import {addPageSetAction, sortableTableSelector, tableAddedAction} from "chums-ducks";
import {defaultDLCodeSort, DLCodeSorterProps} from "../dlCodes/types";
import DLCodeList from "../dlCodes/DLCodeList";
import {noop} from "chums-components";

const tableKey = 'selected-step-where-used';

const SelectedWhereUsedList: React.FC = () => {
    const dispatch = useDispatch();
    const sortProps = useSelector(sortableTableSelector(tableKey));
    const list = useSelector(whereUsedSelector(sortProps as DLCodeSorterProps));


    useEffect(() => {
        dispatch(addPageSetAction({key: tableKey}));
        dispatch(tableAddedAction({key: tableKey, ...defaultDLCodeSort}));
    }, [])

    return (
        <DLCodeList list={list} sort={{field: 'dlCode', ascending: true}} onChangeSort={noop}/>
    )
}
export default SelectedWhereUsedList;
