import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentStep, selectFilteredList, selectStepsLoaded, selectStepsSort} from "./selectors";
import {loadDLSteps, setStepSort} from "./actions";
import {DLBasicStep, DLStep, SortProps} from "chums-types";
import {dlStepKey} from "./utils";
import {stepsListFields} from "./StepsListFields";
import {useNavigate} from "react-router-dom";
import {dlStepPath} from "../../routerPaths";
import DLStepsFilter from "./DLStepsFilter";
import {useAppDispatch} from "../../app/configureStore";
import {LocalStore, SortableTable, TablePagination} from "chums-components";
import classNames from "classnames";
import {localStorageKeys} from "../../api/preferences";
import ErrorBoundary from '../../components/ErrorBoundary';

const tableKey = 'steps-list';
const defaultSort: SortProps<DLStep> = {
    field: 'stepCode',
    ascending: true,
}

const StepsList = () => {
    // const history = useHistory();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const sort = useSelector(selectStepsSort);
    const loaded = useSelector(selectStepsLoaded);
    const list = useSelector(selectFilteredList);
    const selected = useSelector(selectCurrentStep);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(LocalStore.getItem<number>(localStorageKeys.dlStepsRowsPerPage, 25) ?? 25);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadDLSteps());
        }
    }, []);

    useEffect(() => {
        setPage(0);
    }, [list, sort, rowsPerPage])

    const onSelectRow = (row: DLBasicStep) => {
        navigate(dlStepPath(row.id));
   }

    const sortChangeHandler = (sort: SortProps) => {
        dispatch(setStepSort(sort));
    }

    const rowsPerPageChangeHandler = (rpp: number) => {
        LocalStore.setItem<number>(localStorageKeys.dlStepsRowsPerPage, rpp);
        setRowsPerPage(rpp);
    }

    const pagedList = list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <ErrorBoundary>
            <div className="mt-3">
                <SortableTable keyField={dlStepKey} fields={stepsListFields}
                               currentSort={sort} onChangeSort={sortChangeHandler}
                               data={pagedList} size="sm"
                               rowClassName={(row: DLBasicStep) => classNames({'table-warning': !row.active})}
                               selected={selected?.id} onSelectRow={onSelectRow}/>
                <TablePagination page={page} onChangePage={setPage}
                                 rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                                 count={list.length} showFirst showLast/>
            </div>
        </ErrorBoundary>
    )
}

export default StepsList;
