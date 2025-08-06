import type {SortProps, WorkTemplate, WorkTemplateStep} from "chums-types";
import {createReducer} from "@reduxjs/toolkit";
import {loadTemplate, loadTemplateList, setTemplatesSearch, setTemplatesSort} from "./actions";
import {isTemplateStepCount, templateKey, templateSorter} from "./utils";

export interface TemplatesState {
    list: {
        templates: WorkTemplate[],
        status: 'idle'|'pending';
        loaded: boolean;
        sort:SortProps<WorkTemplate>;
        filter: {
            search: string;
        }
    }
    current: {
        key: string;
        template: WorkTemplate|null;
        status: 'idle'|'pending';
        steps: WorkTemplateStep[]
    }
}

export const initialTemplatesState:TemplatesState = {
    list: {
        templates: [],
        status: 'idle',
        loaded: false,
        sort: {field: 'TemplateNo', ascending: true},
        filter: {
            search: '',
        }
    },
    current: {
        key: '',
        template: null,
        status: 'idle',
        steps: []
    }
};

const templatesReducer = createReducer(initialTemplatesState, (builder) => {
    builder
        .addCase(loadTemplateList.pending, (state) => {
            state.list.status = 'pending';
        })
        .addCase(loadTemplateList.fulfilled, (state, action) => {
            state.list.status = 'idle';
            state.list.loaded = true;
            state.list.templates = [...action.payload].sort(templateSorter({...initialTemplatesState.list.sort}))
            if (state.current.key) {
                const [template] = action.payload.filter(row => templateKey(row) === state.current.key);
                if (!template) {
                    state.current.key = '';
                    state.current.template = null;
                    state.current.steps = [];
                } else {
                    state.current.template = template;
                }
            }
        })
        .addCase(loadTemplateList.rejected, (state) => {
            state.list.status = 'idle';
        })
        .addCase(loadTemplate.pending, (state, action) => {
            state.current.status = 'pending';
            if (state.current.key !== templateKey(action.meta.arg)) {
                state.current.key = templateKey(action.meta.arg);
                state.current.template = null;
                state.current.steps = [];
            }
        })
        .addCase(loadTemplate.fulfilled, (state, action) => {
            state.current.status = 'idle';
            state.current.template = action.payload;
            if (action.payload) {
                state.current.steps = isTemplateStepCount(action.payload.Steps) ? [] : [...action.payload.Steps];
            }
        })
        .addCase(loadTemplate.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(setTemplatesSort, (state, action) => {
            state.list.sort = action.payload;
        })
        .addCase(setTemplatesSearch, (state, action) => {
            state.list.filter.search = action.payload;
        })
});

export default templatesReducer;
