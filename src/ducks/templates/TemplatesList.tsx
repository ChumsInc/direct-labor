import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {
    selectSortedTemplateList,
    selectTemplateListSort,
    selectTemplateListStatus,
    selectTemplatesLoaded
} from "./selectors";
import {loadTemplateList, setTemplatesSort} from "./actions";
import AnimatedLoadingBar from "../../components/AnimatedLoadingBar";
import {SortableTable, type SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import {templateKey, templatePath, templateStepCount} from "./utils";
import type {SortProps, WorkTemplate} from "chums-types";
import {Link, useNavigate} from "react-router";
import NumericTableValue from "../../components/NumericTableValue";
import classNames from "classnames";

const fields: SortableTableField<WorkTemplate>[] = [
    {
        field: 'TemplateNo',
        title: "Template No",
        sortable: true,
        render: (row) => <Link to={templatePath(row)}>{row.TemplateNo}</Link>
    },
    {
        field: 'RevisionNo',
        title: "Revision No",
        sortable: true,
        render: (row) => <Link to={templatePath(row)}>{row.RevisionNo}</Link>
    },
    {field: 'TemplateDesc', title: 'Description', sortable: true},
    {field: 'Steps', title: 'Steps', render: (row) => templateStepCount(row), align: 'end', sortable: true},
    {
        field: 'TemplateCost',
        title: 'Cost',
        align: 'end',
        render: (row) => <NumericTableValue value={row.TemplateCost} format="$0,0.0000"/>,
        sortable: true
    }
]

const TemplatesList = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loaded = useAppSelector(selectTemplatesLoaded);
    const status = useAppSelector(selectTemplateListStatus);
    const sort = useAppSelector(selectTemplateListSort);
    const list = useAppSelector(selectSortedTemplateList);
    const [page, setPage] = useState<number>(0)
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadTemplateList());
        }
    }, [dispatch, loaded]);

    useEffect(() => {
        setPage(0);
    }, [list, sort]);

    const sortChangeHandler = (sort: SortProps<WorkTemplate>) => {
        dispatch(setTemplatesSort(sort));
    }

    const rppChangeHandler = (rpp: number) => {
        setPage(0);
        setRowsPerPage(rpp);
    }

    const rowClassName = (row: WorkTemplate) => classNames({
        'table-warning': row.CurrentRevision !== 'Y',
    })

    const rowClickHandler = (row: WorkTemplate) => {
        navigate(templatePath(row));
    }

    return (
        <div>
            <AnimatedLoadingBar loading={status !== 'idle'}/>
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} size="xs"
                           rowClassName={rowClassName} onSelectRow={rowClickHandler}
                           keyField={templateKey}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rppChangeHandler}}
                             count={list.length}/>
        </div>
    )
}
export default TemplatesList;
