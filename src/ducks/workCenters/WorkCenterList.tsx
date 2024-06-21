import React, {useEffect} from "react";
import {FormCheck, SpinnerButton} from "chums-components";
import {useSelector} from "react-redux";
import {loadWorkCenters, setPage, setRowsPerPage, setSort, toggleFilterRatedWC} from "./actions";
import {
    selectCurrentWorkCenter,
    selectFilterRatedWC,
    selectLoading,
    selectPage,
    selectRowsPerPage,
    selectSortedWorkCenters, selectWorkCentersLoaded, selectWorkCenterSort
} from "./selectors";
import {workCenterKey} from "./types";
import MultiLineField from "../../components/MultiLineField";
import numeral from "numeral";
import {useNavigate} from "react-router-dom";
import {selectedWorkCenterPath} from "../../routerPaths";
import {WorkCenter} from "chums-types";
import {SortableTable, SortableTableField, SortProps, TablePagination} from "chums-components";
import {useAppDispatch} from "../../app/configureStore";

const fields: SortableTableField<WorkCenter>[] = [
    {field: 'WorkCenterCode', title: 'W/C Code', sortable: true},
    {field: 'Description', title: 'Description', sortable: true},
    {
        field: 'CommentLine1',
        title: 'Comment',
        sortable: true,
        render: ({CommentLine1, CommentLine2}: WorkCenter) => (
            <MultiLineField line1={CommentLine1} line2={CommentLine2}/>
        )
    },
    {
        field: 'ChrgAtEmpRate',
        title: 'Employee Rate',
        sortable: true,
        render: ({ChrgAtEmpRate}: WorkCenter) => ChrgAtEmpRate ? 'Y' : 'N'
    },
    {
        field: 'OutsideProcessing',
        title: 'Outside Processing',
        sortable: true,
        render: ({OutsideProcessing}: WorkCenter) => OutsideProcessing ? 'Y' : 'N'
    },
    {
        field: 'AverageHourlyRate',
        title: 'Avg Rate',
        sortable: true,
        render: ({AverageHourlyRate}: WorkCenter) => !!AverageHourlyRate ? numeral(AverageHourlyRate).format('$0.0000') : ''
    },
];

const WorkCenterList: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectLoading);
    const loaded = useSelector(selectWorkCentersLoaded);
    const filter = useSelector(selectFilterRatedWC);
    const list = useSelector(selectSortedWorkCenters);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const sort = useSelector(selectWorkCenterSort);
    const selected = useSelector(selectCurrentWorkCenter);

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadWorkCenters());
        }
    }, [])

    const onReload = () => dispatch(loadWorkCenters());
    const onSelectWorkCenter = (row: WorkCenter) => navigate(selectedWorkCenterPath(row.WorkCenterCode));

    const onChangeFilter = () => dispatch(toggleFilterRatedWC());
    const onChangeSort = (sort: SortProps) => dispatch(setSort(sort));
    const onChangePage = (page: number) => dispatch(setPage(page));
    const onChangeRowsPerPage = (rpp: number) => dispatch(setRowsPerPage(rpp));

    return (
        <div>
            <div className="row g-3">
                <div className="col-auto">
                    <SpinnerButton type="button" color="primary"
                                   size="sm" spinning={loading} onClick={onReload}>
                        Reload
                    </SpinnerButton>
                </div>
                <div className="col-auto">
                    <FormCheck label={"Show Only Rated W/C"} checked={filter}
                               onChange={onChangeFilter} type="checkbox"/>
                </div>
            </div>
            <SortableTable keyField={workCenterKey} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           currentSort={sort} onChangeSort={onChangeSort}
                           size="xs"
                           selected={selected?.WorkCenterCode}
                           onSelectRow={onSelectWorkCenter}/>
            <TablePagination page={page} onChangePage={onChangePage} rowsPerPage={rowsPerPage}
                             onChangeRowsPerPage={onChangeRowsPerPage}
                             count={list.length}/>
        </div>
    )
}
export default WorkCenterList;
