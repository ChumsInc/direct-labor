import React from "react";
import {selectWhereUsed, selectWhereUsedSort} from "./selectors";
import DLCodeList from "../dlCodes/DLCodeList";
import {SortProps} from "chums-components";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {setWhereUsedSort} from "./actions";
import {DLCode} from "chums-types";

const SelectedWhereUsedList: React.FC = () => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectWhereUsed);
    const sort = useAppSelector(selectWhereUsedSort);

    const onChangeSort = (sort: SortProps<DLCode>) => dispatch(setWhereUsedSort(sort));

    return (
        <DLCodeList list={list} sort={sort} onChangeSort={onChangeSort}/>
    )
}
export default SelectedWhereUsedList;
