import type {DLCodeStep} from "chums-types";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import ThumbedDLStep from "@/ducks/dlCodes/ThumbedDLStep.tsx";

export interface SortableDLStepProps {
    step: DLCodeStep;
    active?: boolean;
}

export default function SortableDLStep({step, active}: SortableDLStepProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        setActivatorNodeRef
    } = useSortable({id: step.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <ThumbedDLStep setActivatorNodeRef={setActivatorNodeRef} step={step} listeners={listeners} active={active}/>
        </div>
    )
}
