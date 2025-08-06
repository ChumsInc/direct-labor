import {useSelector} from "react-redux";
import {selectCurrentTiming} from "@/ducks/timings/selectors.ts";
import AddNewTimingEntry from "@/components/direct-labor-steps/timing/AddNewTimingEntry.tsx";
import TimingEntryList from "@/components/direct-labor-steps/timing/TimingEntryList.tsx";


const StepTimingEntries = () => {
    const timing = useSelector(selectCurrentTiming);

    if (!timing) {
        return null;
    }

    return (
        <div className="mt-3">
            <h3>Timing Entries <small className="text-secondary">(minutes)</small></h3>
            <TimingEntryList/>
            <AddNewTimingEntry/>
        </div>
    )
}

export default StepTimingEntries;
