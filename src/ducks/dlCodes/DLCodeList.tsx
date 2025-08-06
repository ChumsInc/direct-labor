import type {DLCode} from "chums-types";
import {SortableTable, type SortProps} from "@chumsinc/sortable-tables";
import classNames from "classnames";
import {dlCodesFields} from "@/ducks/dlCodes/directLaborCodeListFields";

export interface DLCodeListProps {
    list: DLCode[];
    selected?: DLCode | null;
    sort: SortProps<DLCode>;
    onChangeSort: (props: SortProps<DLCode>) => void;
    onSelectDLCode?: (code: DLCode) => void,
}


const DLCodeList = ({list, selected, onSelectDLCode, onChangeSort, sort}: DLCodeListProps) => {
    return (
        <SortableTable keyField="id" fields={dlCodesFields} data={list} size="sm"
                       rowClassName={(row: DLCode) => classNames({'table-warning': !row.active})}
                       currentSort={sort} onChangeSort={onChangeSort}
                       selected={(row) => row.id === selected?.id}
                       onSelectRow={onSelectDLCode}/>
    )
}

export default DLCodeList;
