import type {SortableDLStepProps} from "@/ducks/dlCodes/SortableDLStep.tsx";
import type {SyntheticListenerMap} from "@dnd-kit/core/dist/hooks/utilities";
import styled from "@emotion/styled";
import classNames from "classnames";
import {Button} from "react-bootstrap";
import {DLStepItem} from "@/ducks/dlCodes/DLStepItem.tsx";


const SortableDLStepContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 1rem;
    padding: 0 0;
    margin: 0.25rem 0;
    border: 1px solid var(--bs-border-color);
    border-radius: 0.25rem;
    background-color: var(--bs-body-bg);
    &.active {
        border-color: var(--bs-primary);
    }
    &:focus-within {}
    & > .btn.drag-thumb {
        border-left: none;
        border-top: none;
        border-bottom: none;
        border-radius: 0;
        border-right: 1px solid var(--bs-border-color);
        cursor: grab;
        width: 6rem;
    }
`

export interface ThumbedDLStepProps extends SortableDLStepProps {
    setActivatorNodeRef?: (node: HTMLElement | null) => void;
    listeners?: SyntheticListenerMap|undefined;
}
export default function ThumbedDLStep({step, active, setActivatorNodeRef, listeners}:ThumbedDLStepProps) {
    return (
        <SortableDLStepContainer className={classNames('sortable-item', {active: active ? 'active' : ''})}
                                 ref={setActivatorNodeRef}>
            <Button size="sm" variant="outline-secondary" className="drag-thumb" {...listeners} ref={setActivatorNodeRef}>
                <span className="bi-arrow-down-up me-3" aria-label="Drag to sort" />
                {step.stepOrder}
            </Button>
            <DLStepItem step={step} />
        </SortableDLStepContainer>

    )
}
