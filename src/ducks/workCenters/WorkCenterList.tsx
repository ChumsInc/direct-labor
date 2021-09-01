import React, {useEffect, useState} from "react";
import {
    addPageSetAction,
    FormCheck,
    pagedDataSelector,
    PagerDuck,
    SortableTable,
    sortableTableSelector,
    SpinnerButton,
    tableAddedAction
} from "chums-ducks";
import {useDispatch, useSelector} from "react-redux";
import {loadWorkCentersAction} from "./actions";
import {listSelector, loadedSelector, loadingSelector, selectedWorkCenterSelector} from "./index";
import {defaultWorkCenterSort, workCenterKey, WorkCenterSorterProps, WorkCenterTableField} from "./types";
import MultiLineField from "../../components/MultiLineField";
import numeral from "numeral";
import {useHistory} from "react-router-dom";
import {selectedWorkCenterPath} from "../../routerPaths";
import {WorkCenter} from "../types";

const tableKey = 'work-centers-list';
const fields: WorkCenterTableField[] = [
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
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector(loadingSelector);
    const loaded = useSelector(loadedSelector);
    useEffect(() => {
        dispatch(tableAddedAction({key: tableKey, ...defaultWorkCenterSort}));
        dispatch(addPageSetAction({key: tableKey}));
        if (!loaded && !loading) {
            dispatch(loadWorkCentersAction());
        }
    }, [])
    const onReload = () => dispatch(loadWorkCentersAction());
    const sort = useSelector(sortableTableSelector(tableKey));
    const [showFilter, setShowFilter] = useState(true);
    const list = useSelector(listSelector(sort as WorkCenterSorterProps)).filter(wc => !showFilter || wc.isStandardWC);
    const pagedList = useSelector(pagedDataSelector(tableKey, list));
    const onSelectWorkCenter = (row:WorkCenter) => history.push(selectedWorkCenterPath(row.WorkCenterCode));
    const selected = useSelector(selectedWorkCenterSelector);

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
                    <FormCheck label={"Show Only Rated W/C"} checked={showFilter}
                               onClick={() => setShowFilter(!showFilter)} type="checkbox" />
                </div>
            </div>
            <SortableTable tableKey={tableKey} keyField={workCenterKey} fields={fields} data={pagedList} size="xs"
                           selected={selected?.WorkCenterCode}
                           onSelectRow={onSelectWorkCenter}/>
            <PagerDuck pageKey={tableKey} dataLength={list.length} filtered={showFilter}/>
        </div>
    )
}
export default WorkCenterList;
