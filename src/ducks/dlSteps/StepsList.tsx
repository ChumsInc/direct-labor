import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {
    selectCurrentStep,
    selectFilteredStepsList,
    selectRowsPerPage,
    selectStepsLoaded,
    selectStepsLoading,
    selectStepsPage,
    selectStepsSort
} from "./selectors";
import {loadDLStepsAction, setPage, setRowsPerPage, setStepsSort} from "./actions";
import {SortableTable, TablePagination} from "chums-components";
import {DLStep} from "chums-types";
import {dlStepKey} from "./types";
import {stepsListFields} from "./StepsListFields";
import {useNavigate} from "react-router-dom";
import {dlStepPath} from "../../routerPaths";
import DLStepsFilter from "./DLStepsFilter";
import {useAppDispatch} from "../../app/configureStore";
import {SortProps} from "chums-types";
import classNames from "classnames";

const StepsList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const sort = useSelector(selectStepsSort)
    const loading = useSelector(selectStepsLoading);
    const loaded = useSelector(selectStepsLoaded);
    const list = useSelector(selectFilteredStepsList);
    const selected = useSelector(selectCurrentStep);
    const page = useSelector(selectStepsPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const [pagedList, setPagedList] = useState(list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));

    useEffect(() => {
        setPagedList(list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))
    }, [list, page, rowsPerPage]);

    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(loadDLStepsAction());
        }
    }, [loading, loaded]);

    const sortChangeHandler = (sort: SortProps) => dispatch(setStepsSort(sort));

    const onSelectRow = (row: DLStep) => {
        navigate(dlStepPath(row.id));
    }

    const rowClassName = (row: DLStep) => classNames({'table-warning': !row.active});
    return (
        <div>
            <DLStepsFilter/>
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler}
                           keyField={dlStepKey} fields={stepsListFields} data={pagedList} size="xs"
                           rowClassName={rowClassName}
                           selected={selected?.id} onSelectRow={onSelectRow}/>
            <TablePagination page={page} onChangePage={(page) => dispatch(setPage(page))}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={(rpp) => setRowsPerPage(rpp)}
                             count={list.length} showFirst showLast/>
        </div>
    )
}

export default StepsList;
