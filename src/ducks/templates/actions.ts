import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {SortProps, WorkTemplate} from "chums-types";
import {RootState} from "../../app/configureStore";
import {selectCurrentTemplateStatus, selectTemplateListStatus} from "./selectors";
import {fetchWorkTemplate, fetchWorkTemplates} from "./api";

export const loadTemplateList = createAsyncThunk<WorkTemplate[]>(
    'templates/list/load',
    async () => {
        return fetchWorkTemplates();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectTemplateListStatus(state) === 'idle';
        }
    }
)

export const loadTemplate = createAsyncThunk<WorkTemplate | null, Pick<WorkTemplate, 'TemplateNo' | 'RevisionNo'>>(
    'templates/current/load',
    async (arg) => {
        return fetchWorkTemplate(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentTemplateStatus(state) === 'idle';

        }
    }
)

export const setTemplatesSort = createAction<SortProps<WorkTemplate>>('templates/list/setSort');
export const setTemplatesSearch = createAction<string>('templates/list/setSearch');
