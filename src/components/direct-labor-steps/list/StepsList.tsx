import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentStep, selectFilteredList, selectStepsLoaded, selectStepsSort, setStepSort} from "@/ducks/dlSteps";
import {loadDLSteps} from "@/ducks/dlSteps/actions.ts";
import type {DLBasicStep, DLStep, SortProps} from "chums-types";
import {dlStepKey} from "@/ducks/dlSteps/utils.ts";
import {stepsListFields} from "./stepsListFields.tsx";
import {useNavigate} from "react-router";
import {dlStepPath} from "@/app/routerPaths.ts";
import {useAppDispatch} from "@/app/configureStore.ts";
import {SortableTable, TablePagination} from "@chumsinc/sortable-tables";
import classNames from "classnames";
import {localStorageKeys} from "@/api/preferences.ts";
import AppErrorBoundary from '@/components/AppErrorBoundary.tsx';
import {LocalStore} from "@chumsinc/ui-utils";
import DocumentTitle from "@/components/common/DocumentTitle.tsx";


const StepsList = () => {
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

    const sortChangeHandler = (sort: unknown) => {
        dispatch(setStepSort(sort as SortProps<DLBasicStep | DLStep>));
    }

    const rowsPerPageChangeHandler = (rpp: number) => {
        LocalStore.setItem<number>(localStorageKeys.dlStepsRowsPerPage, rpp);
        setRowsPerPage(rpp);
    }

    const rowClassName = (row: DLBasicStep) => classNames({'table-warning': !row.active});

    return (
        <AppErrorBoundary>
            <DocumentTitle>Direct Labor Steps</DocumentTitle>
            <div className="mt-3">
                <SortableTable keyField={dlStepKey} fields={stepsListFields} size="sm"
                               currentSort={sort} onChangeSort={sortChangeHandler}
                               data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                               rowClassName={rowClassName}
                               selected={selected?.id}
                               onSelectRow={onSelectRow}/>
                <TablePagination page={page} onChangePage={setPage} size="sm"
                                 rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                                 count={list.length} showFirst showLast/>
            </div>
        </AppErrorBoundary>
    )
}

export default StepsList;
