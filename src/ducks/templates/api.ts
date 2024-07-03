import {WorkTemplate, WorkTemplateStep} from "chums-types";
import {fetchJSON} from "chums-components";

export async function fetchWorkTemplates():Promise<WorkTemplate[]> {
    try {
        const url = '/api/operations/production/pm/templates.json';
        const res = await fetchJSON<{templates:WorkTemplate[]}>(url, {cache: 'no-cache'});
        return res?.templates ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkTemplates()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkTemplates()", err);
        return Promise.reject(new Error('Error in fetchWorkTemplates()'));
    }
}

export async function fetchWorkTemplate(arg:Pick<WorkTemplate, 'TemplateNo'|'RevisionNo'>):Promise<WorkTemplate|null> {
    try {
        const params = new URLSearchParams();
        params.set('revisionNo', arg.RevisionNo);

        const url = `/api/operations/production/pm/templates/:templateNo.json?${params.toString()}`
            .replace(':templateNo', encodeURIComponent(arg.TemplateNo));
        const res = await fetchJSON<{template:WorkTemplate|null}>(url, {cache: 'no-cache'});
        return res?.template ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkTemplate()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkTemplate()", err);
        return Promise.reject(new Error('Error in fetchWorkTemplate()'));
    }
}
