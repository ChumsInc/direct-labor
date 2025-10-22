import styled from "@emotion/styled";
import numeral from "numeral";
import type {DLStepTotal} from "@/ducks/types.ts";

const DLStepTotalContainer = styled.div`
    flex: 1 1 auto;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bs-body-bg);
    font-weight: 700;

    & > .btn:last-child {
        border-right: none;
        border-top: none;
        border-bottom: none;
        border-radius: 0;
        border-left: 1px solid var(--bs-border-color);
    }
`

export interface DLStepItemsTotalProps {
    total: DLStepTotal;
}

export function DLStepItemsTotal({total}: DLStepItemsTotalProps) {
    return (
        <DLStepTotalContainer>
            <div style={{flex: '0 0 4rem', fontWeight: '700'}}>
                Total
            </div>
            <div style={{flex: '1 1 100%', textAlign: 'left', marginLeft: '1rem'}}>
            </div>
            <div style={{flex: '0 0 6rem', textAlign: 'right', fontWeight: '700'}}>
                {numeral(total.standardAllowedMinutes).format('0,0.0000')}
            </div>
            <div style={{flex: '0 0 6rem', textAlign: 'right', fontWeight: '700'}}>
                {numeral(total.fixedCosts).format('0,0.0000')}
            </div>
            <div style={{flex: '0 0 6rem', textAlign: 'right', fontWeight: '700'}}>
                {numeral(total.stepCost).format('0,0.0000')}
            </div>
            <div style={{flex: '0 0 3rem'}}>

            </div>
        </DLStepTotalContainer>
    )
}
