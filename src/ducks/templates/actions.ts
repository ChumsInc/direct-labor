import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import type {SortProps, WorkTemplate} from "chums-types";
import type {RootState} from "../../app/configureStore";
import {selectCurrentTemplateStatus, selectTemplateListStatus} from "./selectors";
import {fetchWorkTemplate, fetchWorkTemplates} from "./api";

export const loadTemplateList = createAsyncThunk<WorkTemplate[]>(
    'templates/data/load',
    async () => {
        return fetchWorkTemplates();
    },
    {
        condition: (_, {getState}) => {
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
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentTemplateStatus(state) === 'idle';

        }
    }
)

export const setTemplatesSort = createAction<SortProps<WorkTemplate>>('templates/data/setSort');
export const setTemplatesSearch = createAction<string>('templates/data/setSearch');
