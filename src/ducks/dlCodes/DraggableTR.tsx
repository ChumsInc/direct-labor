import React, {useRef} from "react";
import {SortableTR} from "chums-ducks";
import {SortableTRProps} from "chums-ducks/dist/ducks/sortableTables/SortableTR";
import {DLCodeStep} from "../types";
import {DropTargetMonitor, useDrag, useDrop, XYCoord} from "react-dnd";
import "./DraggableTR.scss";
import classNames from "classnames";

export interface DraggableTRProps extends SortableTRProps {
    row: DLCodeStep,
    index: number,
    moveItem: (dragIndex: number, hoverIndex: number) => void,
    onDrop?: () => void,
}

interface DragItem {
    index: number,
    id: string,
    type: string,
}

const DraggableTR: React.FC<DraggableTRProps> = ({fields, row, className, index, moveItem, onDrop}) => {
    const ref = useRef<HTMLTableRowElement>(null);

    const [{handlerId}, drop] = useDrop({
        accept: 'item',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor: DropTargetMonitor) {
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
            const hoverMiddleX = (hoverBoundingRect.left - hoverBoundingRect.right) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
            const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

            if (dragIndex < hoverIndex && (hoverClientX < hoverMiddleX || hoverClientY < hoverMiddleY)) {
                return;
            }

            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
        drop(item: DragItem, monitor) {
            if(!ref.current) {
                return;
            }
            if (!!onDrop) {
                onDrop();
            }
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
    return (
        <SortableTR fields={fields} row={row} trRef={ref}
                    className={classNames(className, 'draggable-tr', {'is-dragging': isDragging})}/>
    )
}

export default DraggableTR;
