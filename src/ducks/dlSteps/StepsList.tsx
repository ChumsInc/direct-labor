import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    filteredListSelector,
    listLengthSelector,
    loadedSelector,
    loadingSelector,
    selectedStepSelector
} from "./selectors";
import {loadDLStepsAction} from "./actions";
import {
    addPageSetAction,
    pagedDataSelector,
    PagerDuck,
    SortableTable,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks";
import {DLStep, DLStepSorterProps} from "../types";
import {dlStepKey} from "./types";
import {stepsListFields} from "./StepsListFields";
import {useHistory} from "react-router-dom";
import {dlStepPath} from "../../routerPaths";
import DLStepsFilter from "./DLStepsFilter";

const tableKey = 'steps-list';
const defaultSort: DLStepSorterProps = {
    field: 'stepCode',
    ascending: true,
}

const StepsList: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const sort = useSelector(sortableTableSelector(tableKey))
    const loading = useSelector(loadingSelector);
    const loaded = useSelector(loadedSelector);
    const list = useSelector(filteredListSelector(sort as DLStepSorterProps));
    const stepsCount = useSelector(listLengthSelector)
    const pagedList = useSelector(pagedDataSelector(tableKey, list));
    const selected = useSelector(selectedStepSelector);

    useEffect(() => {
        dispatch(tableAddedAction({key: tableKey, ...defaultSort}))
        dispatch(addPageSetAction({key: tableKey}))
    }, []);
    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(loadDLStepsAction());
        }
    }, [loading, loaded]);

    const onSelectRow = (row: DLStep) => {
        history.push(dlStepPath(row.id));
    }

    return (
        <div>
            <DLStepsFilter/>
            <SortableTable tableKey={tableKey} keyField={dlStepKey} fields={stepsListFields} data={pagedList} size="xs"
                           rowClassName={(row: DLStep) => ({'table-warning': !row.active})}
                           selected={selected.id} onSelectRow={onSelectRow}/>
            <PagerDuck pageKey={tableKey} dataLength={list.length} filtered={list.length !== stepsCount}/>
        </div>
    )
}

export default StepsList;
