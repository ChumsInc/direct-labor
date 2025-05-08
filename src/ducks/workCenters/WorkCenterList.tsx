import React, {ChangeEvent, useEffect, useId, useState} from "react";
import {
    SortableTable,
    SortableTableField,
    SortProps,
    TablePagination
} from "@chumsinc/sortable-tables";
import {useSelector} from "react-redux";
import {loadWorkCenters, setSort, setWCSearch, toggleFilterRatedWC} from "./actions";
import {
    selectCurrentWorkCenter,
    selectFilterRatedWC,
    selectLoading,
    selectSortedWorkCenters, selectWorkCenterSearch,
    selectWorkCentersLoaded,
    selectWorkCenterSort
} from "./selectors";
import {workCenterKey} from "./utils";
import numeral from "numeral";
import {useNavigate} from "react-router";
import {selectedWorkCenterPath} from "../../routerPaths";
import {WorkCenter} from "chums-types";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import Decimal from "decimal.js";
import {FormCheck} from "react-bootstrap";
import SpinnerButton from "@/components/common/SpinnerButton";

const fields: SortableTableField<WorkCenter>[] = [
    {field: 'workCenter', title: 'W/C Code', sortable: true},
    {field: 'workCenterDesc', title: 'Description', sortable: true},
    {
        field: 'efficiencyPercent',
        title: 'Efficiency',
        sortable: true,
        align: 'end',
        render: ({efficiencyPercent}: WorkCenter) => numeral(new Decimal(efficiencyPercent).div(100)).format('0,0%')
    },
    {
        field: 'averageHourlyRate',
        title: 'Avg Rate',
        sortable: true,
        align: 'end',
        render: ({averageHourlyRate}: WorkCenter) => !averageHourlyRate ? '' : numeral(averageHourlyRate).format('$0.0000')
    },
];

const WorkCenterList: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectLoading);
    const loaded = useSelector(selectWorkCentersLoaded);
    const filter = useSelector(selectFilterRatedWC);
    const list = useSelector(selectSortedWorkCenters);
    const sort = useSelector(selectWorkCenterSort);
    const selected = useSelector(selectCurrentWorkCenter);
    const search = useAppSelector(selectWorkCenterSearch);
    const searchId = useId();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadWorkCenters());
        }
    }, [])

    useEffect(() => {
        setPage(0);
    }, [list, sort]);

    const onReload = () => dispatch(loadWorkCenters());
    const onSelectWorkCenter = (row: WorkCenter) => {
        navigate(selectedWorkCenterPath(row.workCenter));
    }

    const onChangeFilter = () => dispatch(toggleFilterRatedWC());
    const onChangeSort = (sort: SortProps<WorkCenter>) => dispatch(setSort(sort));
    const onChangePage = (page: number) => setPage(page);
    const onChangeRowsPerPage = (rpp: number) => {
        setPage(0)
        setRowsPerPage(rpp);
    }

    const searchChangeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(setWCSearch(ev.target.value));
    }

    return (
        <div>
            <div className="row g-3 align-items-baseline">
                <div className="col">
                    <div className="input-group">
                        <label className="input-group-text" htmlFor={searchId}>Search</label>
                        <input type="search" value={search} onChange={searchChangeHandler} id={searchId}
                               className="form-control"/>
                    </div>

                </div>
                <div className="col-auto">
                    <FormCheck label={"Show Only Rated W/C"} checked={filter}
                               onChange={onChangeFilter} type="checkbox"/>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" variant="primary" spinning={loading} onClick={onReload}>
                        Reload
                    </SpinnerButton>
                </div>
            </div>
            <SortableTable keyField={workCenterKey} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           currentSort={sort} onChangeSort={onChangeSort}
                           size="sm"
                           selected={selected?.workCenter}
                           onSelectRow={onSelectWorkCenter}/>
            <TablePagination page={page} onChangePage={onChangePage} rowsPerPage={rowsPerPage}
                             rowsPerPageProps={{onChange: onChangeRowsPerPage}} showFirst showLast
                             count={list.length}/>
        </div>
    )
}
export default WorkCenterList;
