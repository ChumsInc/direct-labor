import type {DLCode} from "chums-types";
import {SortableTable, type SortableTableProps} from "@chumsinc/sortable-tables";
import classNames from "classnames";

export type DLCodeListProps = Omit<SortableTableProps<DLCode>, 'keyField'>;

export default function DLCodeList({
                                       data,
                                       fields,
                                       selected,
                                       onChangeSort,
                                       currentSort,
                                       onSelectRow,
                                   }: DLCodeListProps) {
    return (
        <SortableTable keyField="id" className="table-striped"
                       fields={fields}
                       data={data} size="sm"
                       rowClassName={(row: DLCode) => classNames({'table-warning': !row.active, })}
                       currentSort={currentSort} onChangeSort={onChangeSort}
                       selected={(row) => row.id === selected}
                       onSelectRow={onSelectRow}/>
    )
}
