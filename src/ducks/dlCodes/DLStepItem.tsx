import type {DLCodeStep} from "chums-types";
import styled from "@emotion/styled";
import {dlStepPath} from "@/app/routerPaths.ts";
import {Link} from "react-router";
import numeral from "numeral";
import DeleteStepButton from "@/ducks/dlCodes/DeleteStepButton.tsx";

const DLStepContainer = styled.div`
    flex: 1 1 auto;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bs-body-bg);

    & > .btn:last-child {
        border-right: none;
        border-top: none;
        border-bottom: none;
        border-radius: 0;
        border-left: 1px solid var(--bs-border-color);
    }
`

export interface DLStepItemProps {
    step: DLCodeStep;
}

export function DLStepItem({step}: DLStepItemProps) {
    return (
        <DLStepContainer>
            <div style={{flex: '0 0 4rem'}}>
                <Link to={dlStepPath(step.stepId)}>{step.stepCode}</Link>
            </div>
            <div style={{flex: '1 1 100%', textAlign: 'left', marginLeft: '1rem'}}>
                {step.description}
            </div>
            <div style={{flex: '0 0 6rem', textAlign: 'left'}}>
                {step.workCenter}
            </div>
            <div style={{flex: '0 0 12rem', textAlign: 'left'}}>
                {step.machine}
            </div>
            <div style={{flex: '0 0 6rem', textAlign: 'right'}}>
                {numeral(step.standardAllowedMinutes).format('0,0.0000')}
            </div>
            <div style={{flex: '0 0 6rem', textAlign: 'right'}}>
                {numeral(step.fixedCosts).format('0,0.0000')}
            </div>
            <div style={{flex: '0 0 6rem', textAlign: 'right'}}>
                {numeral(step.stepCost).format('0,0.0000')}
            </div>
            <div style={{flex: '0 0 3rem'}}>
                <DeleteStepButton step={step}/>
            </div>
        </DLStepContainer>
    )
}
