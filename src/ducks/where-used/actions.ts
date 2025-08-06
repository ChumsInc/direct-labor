import type {TemplateWhereUsedResponse} from "@/ducks/types";
import {fetchJSON} from "@chumsinc/ui-utils";
import {createAsyncThunk} from "@reduxjs/toolkit";
import type {RootState} from "@/app/configureStore";
import {selectWhereUsedStatus} from "@/ducks/where-used/index";

async function fetchTemplateWhereUsed(arg:string):Promise<TemplateWhereUsedResponse|null> {
    try {
        const url = `/api/operations/production/pm/templates/:templateNo/where-used.json`
            .replace(':templateNo', encodeURIComponent(arg))
        const res = await fetchJSON<{result:TemplateWhereUsedResponse}>(url, {cache: 'no-cache'});
        return res?.result ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchTemplateWhereUsed()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchTemplateWhereUsed()", err);
        return Promise.reject(new Error('Error in fetchTemplateWhereUsed()'));
    }
}

export const loadTemplateWhereUsed = createAsyncThunk<TemplateWhereUsedResponse|null, string, {state:RootState}>(
    'where-used/loadTemplate',
    async (arg) => {
        return fetchTemplateWhereUsed(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState();
            return selectWhereUsedStatus(state) === 'idle';
        }
    }

)
