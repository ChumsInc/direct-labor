import {combineReducers} from "redux";
import {defaultDLCodeSort, defaultState, DLCodesAction} from "./types";
import {DLCode, DLCodeList, DLCodeStep, DLCodeSteps} from "../types";
import {
    dlCodeChanged,
    dlCodeSelected,
    deleteStepRequested,
    filterChanged, filterInactiveChanged,
    loadDLCodeFailed,
    loadDLCodeRequested,
    loadDLCodesFailed,
    loadDLCodesRequested,
    loadDLCodesSucceeded,
    loadDLCodeSucceeded,
    saveDLCodeFailed,
    saveDLCodeRequested,
    saveDLCodeSucceeded,
    sortDLStepSucceeded,
    stepAddSucceeded,
    wcFilterChanged, deleteStepSucceeded, deleteStepFailed
} from "./actionTypes";
import {SortProps} from "chums-components";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {createReducer} from "@reduxjs/toolkit";
import {
    addDLStep,
    loadDLCode,
    loadDLCodes, rebuildDLCode, recalcDLCodes, removeDLStep, saveDLCode, saveDLStepSort,
    setPage,
    setRowsPerPage,
    setSearch,
    setSort,
    setWorkCenterFilter,
    toggleShowInactive
} from "./actions";
import {dlCodeStepSorter} from "./utils";

export interface DLCodesState {
    list: DLCodeList;
    loading: boolean;
    loaded: boolean;
    current: {
        header: DLCode|null;
        steps: DLCodeStep[];
        loading: boolean;
        saving: boolean;
        changed: boolean;
    },
    showInactive: boolean;
    search: string;
    workCenter: string;
    page: number;
    rowsPerPage:number;
    sort:SortProps<DLCode>,
}

const initialState = ():DLCodesState => ({
    list: {},
    loading: false,
    loaded: false,
    current: {
        header: null,
        steps: [],
        loading: false,
        saving: false,
        changed: false,
    },
    showInactive: getPreference(localStorageKeys.dlCodesShowInactive, false),
    search: '',
    workCenter: getPreference(localStorageKeys.dlCodesWorkCenter, ''),
    page: 0,
    rowsPerPage: getPreference(localStorageKeys.dlCodesRowsPerPage, 25),
    sort: {...defaultDLCodeSort},
})

const dlCodesReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setWorkCenterFilter, (state, action) => {
            state.workCenter = action.payload;
            setPreference(localStorageKeys.dlCodesWorkCenter, action.payload);
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
            setPreference(localStorageKeys.dlCodesShowInactive, state.showInactive);
        })
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.page = 0;
            state.rowsPerPage = action.payload;
            setPreference(localStorageKeys.dlCodesRowsPerPage, action.payload);
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
        .addCase(loadDLCodes.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadDLCodes.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = action.payload ?? {};
            if (state.current.header) {
                state.current.header = state.list[state.current.header.id] ?? null;
                if (!state.current.header) {
                    state.current.steps = [];
                }
            }
        })
        .addCase(loadDLCodes.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loadDLCode.pending, (state, action) => {
            state.current.loading = true;
            if (!action.meta.arg || state.current.header?.id !== action.meta.arg?.id) {
                state.current.steps = [];
            }
            state.current.header = action.meta.arg ?? null;
        })
        .addCase(loadDLCode.fulfilled, (state, action) => {
            state.current.loading = false;
            state.current.header = action.payload?.dlCode ?? null;
            state.current.steps = action.payload?.steps.sort(dlCodeStepSorter) ?? [];
            if (action.payload?.dlCode) {
                state.list[action.payload.dlCode.id] = action.payload.dlCode;
            }
        })
        .addCase(loadDLCode.rejected, (state) => {
            state.current.loading = false;
        })
        .addCase(saveDLCode.pending, (state, action) => {
            state.current.saving = true;
        })
        .addCase(saveDLCode.fulfilled, (state, action) => {
            state.current.saving = false;
            state.current.header = action.payload?.dlCode ?? null;
            state.current.steps = action.payload?.steps.sort(dlCodeStepSorter) ?? [];
            if (action.payload?.dlCode) {
                state.list[action.payload.dlCode.id] = action.payload.dlCode;
            }
        })
        .addCase(saveDLCode.rejected, (state) => {
            state.current.saving = false;
        })
        .addCase(addDLStep.pending, (state, action) => {
            state.current.saving = true;
        })
        .addCase(addDLStep.fulfilled, (state, action) => {
            state.current.saving = false;
            state.current.header = action.payload?.dlCode ?? null;
            state.current.steps = action.payload?.steps.sort(dlCodeStepSorter) ?? [];
            if (action.payload?.dlCode) {
                state.list[action.payload.dlCode.id] = action.payload.dlCode;
            }
        })
        .addCase(addDLStep.rejected, (state) => {
            state.current.saving = false;
        })
        .addCase(rebuildDLCode.pending, (state, action) => {
            state.current.loading = true;
        })
        .addCase(rebuildDLCode.fulfilled, (state, action) => {
            state.current.loading = false;
            state.current.header = action.payload?.dlCode ?? null;
            state.current.steps = action.payload?.steps.sort(dlCodeStepSorter) ?? [];
            if (action.payload?.dlCode) {
                state.list[action.payload.dlCode.id] = action.payload.dlCode;
            }
        })
        .addCase(rebuildDLCode.rejected, (state) => {
            state.current.loading = false;
        })
        .addCase(saveDLStepSort.pending, (state, action) => {
            state.current.saving = true;
        })
        .addCase(saveDLStepSort.fulfilled, (state, action) => {
            state.current.saving = false;
            state.current.header = action.payload?.dlCode ?? null;
            state.current.steps = action.payload?.steps.sort(dlCodeStepSorter) ?? [];
            if (action.payload?.dlCode) {
                state.list[action.payload.dlCode.id] = action.payload.dlCode;
            }
        })
        .addCase(saveDLStepSort.rejected, (state) => {
            state.current.saving = false;
        })
        .addCase(removeDLStep.pending, (state, action) => {
            state.current.saving = true;
        })
        .addCase(removeDLStep.fulfilled, (state, action) => {
            state.current.saving = false;
            state.current.header = action.payload?.dlCode ?? null;
            state.current.steps = action.payload?.steps.sort(dlCodeStepSorter) ?? [];
            if (action.payload?.dlCode) {
                state.list[action.payload.dlCode.id] = action.payload.dlCode;
            }
        })
        .addCase(removeDLStep.rejected, (state) => {
            state.current.saving = false;
        })
        .addCase(recalcDLCodes.pending, (state) => {
            state.loading = true;
        })
        .addCase(recalcDLCodes.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload;
            if (state.current.header) {
                state.current.header = action.payload[state.current.header.id] ?? null;
            }
        })
        .addCase(recalcDLCodes.rejected, (state) => {
            state.loading = false;
        })

})


const listReducer = (state: DLCodeList = defaultState.list, action: DLCodesAction): DLCodeList => {
    const {type, payload} = action;
    switch (type) {
    case loadDLCodesSucceeded:

        return payload?.list || {};
    case saveDLCodeSucceeded:
    case stepAddSucceeded:
    case loadDLCodeSucceeded:
        if (payload?.header) {
            const dlCode = payload.header;
            return {
                ...state,
                [dlCode.id]: dlCode,
            }
        }
        return state;
    default:
        return state;
    }
}

const selectedHeaderReducer = (state: DLCode = defaultState.selected.header, action: DLCodesAction): DLCode => {
    const {type, payload} = action;
    switch (type) {
    case loadDLCodeSucceeded:
    case saveDLCodeSucceeded:
    case stepAddSucceeded:
    case sortDLStepSucceeded:
    case dlCodeSelected:
        if (payload?.header) {
            return {...payload.header};
        }
        return state;
    case dlCodeChanged:
        if (payload?.change) {
            return {...state, ...payload.change, changed: true};
        }
        return state;
    default:
        return state;
    }
}

const selectedStepsReducer = (state: DLCodeSteps = defaultState.selected.steps, action: DLCodesAction): DLCodeSteps => {
    const {type, payload} = action;
    switch (type) {
    case loadDLCodeSucceeded:
    case saveDLCodeSucceeded:
    case stepAddSucceeded:
    case sortDLStepSucceeded:
    case dlCodeSelected:
    case deleteStepSucceeded:
        if (payload?.steps) {
            return {...payload.steps};
        }
        return state;
    default:
        return state;
    }
}

const selectedSavingReducer = (state: boolean = false, action: DLCodesAction): boolean => {
    switch (action.type) {
    case saveDLCodeRequested:
    case deleteStepRequested:
        return true;
    case saveDLCodeSucceeded:
    case saveDLCodeFailed:
    case deleteStepSucceeded:
    case deleteStepFailed:
        return false;
    default:
        return state;
    }
}

const selectedLoadingReducer = (state: boolean = false, action: DLCodesAction): boolean => {
    switch (action.type) {
    case loadDLCodeRequested:
        return true;
    case loadDLCodeFailed:
    case loadDLCodeSucceeded:
        return false;
    default:
        return state;
    }
}

const selectedChangedReducer = (state: boolean = false, action: DLCodesAction): boolean => {
    switch (action.type) {
    case dlCodeChanged:
        return true;
    case loadDLCodeSucceeded:
    case loadDLCodesSucceeded:
    case saveDLCodeSucceeded:
    case deleteStepSucceeded:
        return false;
    default:
        return state;
    }
}

const selectedReducer = combineReducers({
    header: selectedHeaderReducer,
    steps: selectedStepsReducer,
    loading: selectedLoadingReducer,
    saving: selectedSavingReducer,
    changed: selectedChangedReducer,
})

const loadingReducer = (state: boolean = defaultState.loading, action: DLCodesAction): boolean => {
    switch (action.type) {
    case loadDLCodesRequested:
        return true;
    case loadDLCodesSucceeded:
    case loadDLCodesFailed:
        return false;
    default:
        return state;
    }
}

const loadedReducer = (state: boolean = defaultState.loaded, action: DLCodesAction): boolean => {
    switch (action.type) {
    case loadDLCodesSucceeded:
        return true;
    default:
        return state;
    }
}

const filterReducer = (state: string = defaultState.filter, action: DLCodesAction): string => {
    const {type, payload} = action;
    switch (type) {
    case filterChanged:
        return payload?.filter || '';
    default:
        return state;
    }
}

const workCenterFilterReducer = (state: string = defaultState.filter, action: DLCodesAction): string => {
    const {type, payload} = action;
    switch (type) {
    case wcFilterChanged:
        return payload?.filter || '';
    default:
        return state;
    }
}

const filterInactiveReducer = (state:boolean = defaultState.filterInactive, action:DLCodesAction):boolean => {
    switch (action.type) {
    case filterInactiveChanged:
        return !state;
    default: return state;
    }
}

// export default combineReducers({
//     list: listReducer,
//     selected: selectedReducer,
//     loading: loadingReducer,
//     loaded: loadedReducer,
//     filter: filterReducer,
//     wcFilter: workCenterFilterReducer,
//     filterInactive: filterInactiveReducer,
// })

export default dlCodesReducer;
