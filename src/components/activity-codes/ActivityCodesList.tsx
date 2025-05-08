import React, {useEffect, useState} from 'react';
import {SortableTable, SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {
    selectActivityCodesLoaded,
    selectActivityCodesSort,
    selectActivityCodesStatus,
    selectCurrentActivityCode,
    selectSortedActivityCodes
} from "@/ducks/activity-codes/selectors";
import {ActivityCode, SortProps} from "chums-types";
import {loadActivityCodes, setActivityCodeSort} from "@/ducks/activity-codes/actions";
import {activityCodeKey, activityCodePath} from "@/ducks/activity-codes/utils";
import {useNavigate} from "react-router";
import ActivityCodesFilter from "./ActivityCodesFilter";
import AnimatedLoadingBar from "../AnimatedLoadingBar";
import NumericTableValue from "../NumericTableValue";


const fields: SortableTableField<ActivityCode>[] = [
    {field: 'ActivityCode', title: 'Activity Code', sortable: true},
    {field: 'WorkCenter', title: 'Work Center', sortable: true},
    {field: 'ActivityDesc', title: 'Description', sortable: true},
    {
        field: 'StandardCostPerHour',
        title: 'Cost/Hr',
        sortable: true,
        align: 'end',
        render: (row) => <NumericTableValue value={row.StandardCostPerHour} format={'$0,0.00'}/>,
    },
    {
        field: 'StepAvgCost',
        title: 'Avg Step Cost',
        sortable: true,
        align: 'end',
        render: (row) => <NumericTableValue value={row.StepAvgCost} format="$0,0.0000"/>
    },
    {
        field: 'TemplateCount',
        title: 'On Templates',
        sortable: true,
        align: 'end',
        render: (row) => <NumericTableValue value={row.TemplateCount} format="0,0"/>
    }
];

const ActivityCodesList = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const list = useAppSelector(selectSortedActivityCodes);
    const loaded = useAppSelector(selectActivityCodesLoaded);
    const sort = useAppSelector(selectActivityCodesSort);
    const current = useAppSelector(selectCurrentActivityCode);
    const actionStatus = useAppSelector(selectActivityCodesStatus);

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(25);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadActivityCodes());
        }
    }, []);

    useEffect(() => {
        setPage(0);
    }, [list, sort]);

    const sortChangeHandler = (sort: SortProps) => {
        dispatch(setActivityCodeSort(sort));
    }

    const onSelectActivityCode = (ac: ActivityCode) => {
        navigate(activityCodePath(ac));
    }

    const onChangeRowsPerPage = (rpp: number) => {
        setPage(0);
        setRowsPerPage(rpp);
    }

    console.log({page, rowsPerPage})
    return (
        <div>
            <ActivityCodesFilter/>
            <AnimatedLoadingBar loading={actionStatus !== 'idle'}/>
            <SortableTable keyField={activityCodeKey} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           currentSort={sort} onChangeSort={sortChangeHandler}
                           size="sm" className="mt-3"
                           selected={current ? activityCodeKey(current) : undefined}
                           onSelectRow={onSelectActivityCode}/>
            <TablePagination page={page} onChangePage={setPage} rowsPerPage={rowsPerPage}
                             rowsPerPageProps={{onChange: onChangeRowsPerPage}}
                             showFirst showLast
                             count={list.length}/>
        </div>
    )
}

export default ActivityCodesList;
