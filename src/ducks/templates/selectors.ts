import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {templateSorter} from "./utils";

export const selectTemplateList = (state: RootState) => state.templates.list.templates;
export const selectTemplateListStatus = (state: RootState) => state.templates.list.status;
export const selectTemplateListSort = (state: RootState) => state.templates.list.sort;
export const selectTemplateListSearch = (state: RootState) => state.templates.list.filter.search;
export const selectTemplatesLoaded = (state:RootState) => state.templates.list.loaded;

export const selectCurrentTemplate = (state: RootState) => state.templates.current.template;
export const selectCurrentTemplateStatus = (state: RootState) => state.templates.current.status;
export const selectCurrentTemplateSteps = (state: RootState) => state.templates.current.steps;

export const selectSortedTemplateList = createSelector(
    [selectTemplateList, selectTemplateListSort, selectTemplateListSearch],
    (list, sort, search) => {
        return [...list]
            .filter(t => t.TemplateNo.includes(search.toUpperCase()) || t.TemplateDesc?.toLowerCase().includes(search.toLowerCase()))
            .sort(templateSorter(sort))
    }
)
