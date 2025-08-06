import Decimal from "decimal.js";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectWorkCenters} from "@/ducks/workCenters/selectors.ts";
import NumericTableValue from "@/components/NumericTableValue.tsx";

export interface LaborScalingQtyProps {
    directLaborCost: string|number|Decimal|null;
    workCenter: string|null;
}
export default function LaborScalingQty({directLaborCost, workCenter}:LaborScalingQtyProps) {
    const workCenters = useAppSelector(selectWorkCenters);
    const averageHourlyRate = workCenters.find(wc => wc.workCenter === workCenter)?.averageHourlyRate ?? 0;
    const scalingFactorLabor = directLaborCost !== null
        ? new Decimal(averageHourlyRate).div(directLaborCost).toDecimalPlaces(3).toString()
        : null;

    return (
        <NumericTableValue value={scalingFactorLabor} format="0,0.000" />
    )
}
