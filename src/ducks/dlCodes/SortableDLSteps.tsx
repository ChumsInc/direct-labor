import {closestCenter, DndContext, type DragEndEvent, DragOverlay, type DragStartEvent} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import type {DLCodeStep} from "chums-types";
import {useEffect, useState} from "react";
import SortableDLStep from "@/ducks/dlCodes/SortableDLStep.tsx";
import ThumbedDLStep from "@/ducks/dlCodes/ThumbedDLStep.tsx";

export interface SortableDLStepsProps {
    list: DLCodeStep[],
    onSortChange: (items:DLCodeStep[]) => void,
}

export default function SortableDLSteps({list, onSortChange}:SortableDLStepsProps) {
    const [items, setItems] = useState<DLCodeStep[]>(list);
    const [draggingItem, setDraggingItem] = useState<DLCodeStep | null>(null);

    useEffect(() => {
        setItems(list);
    }, [list]);

    useEffect(() => {
        onSortChange(items);
    }, [items, onSortChange]);

    const handleDragStart = (ev: DragStartEvent) => {
        const [item] = list.filter(item => item.id === ev.active.id)
        setDraggingItem(item ?? null);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        // console.log(event);
        const {active, over} = event;
        if (!over) {
            return;
        }
        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((el) => el.id === active.id);
                const newIndex = items.findIndex((el) => el.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            })
        }
        setDraggingItem(null);
    }

    return (
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} collisionDetection={closestCenter}>
            <SortableContext items={items}>
                {items.map(item => (
                    <SortableDLStep step={item} key={item.id} />
                ))}
            </SortableContext>
            <DragOverlay>
                {draggingItem && (
                    <ThumbedDLStep step={draggingItem} active/>
                )}
            </DragOverlay>
        </DndContext>
    )

}
