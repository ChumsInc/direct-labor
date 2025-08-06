import {useRef} from "react";
import {DataTableRow, type DataTableRowProps} from "@chumsinc/sortable-tables";
import type {DLCodeStep} from "chums-types";
import {useDrag, useDrop} from "react-dnd";
import classNames from "classnames";
import {type Identifier} from "dnd-core";

export interface DraggableTRProps<T = DLCodeStep> extends DataTableRowProps<T> {
    row: T,
    index: number,
    moveItem: (dragIndex: number, hoverIndex: number) => void,
    onDrop?: () => void,
}

interface DragItem {
    index: number,
    id: string,
    type: string,
}

export default function DraggableTR<T = DLCodeStep>({
                                                        fields,
                                                        row,
                                                        className,
                                                        index,
                                                        moveItem,
                                                    }: DraggableTRProps<T>) {
    const ref = useRef<HTMLTableRowElement>(null);

    const [, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
        accept: 'item',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },

        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // const hoverMiddleX = (hoverBoundingRect.left - hoverBoundingRect.right) / 2;
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) {
                return;
            }
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // const hoverClientX = clientOffset.x - hoverBoundingRect.left;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        }
    });

    const [{isDragging}, drag] = useDrag({
        type: 'item',
        item: () => {
            return {row, index};
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging()
        })
    });

    drag(drop(ref));
    const opacity = isDragging ? 0.5 : 1;
    return (
        <DataTableRow fields={fields} row={row} trRef={ref} style={{opacity}}
                      className={classNames(className, 'draggable-tr', {'is-dragging': isDragging})}/>
    )
}
