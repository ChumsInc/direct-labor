import {combineReducers} from "redux";
import {alertsReducer, pagesReducer, sortableTablesReducer, tabsReducer} from "chums-ducks";
import {default as tkAlertsReducer} from "../ducks/alerts";
import {default as billMaterialsReducer} from "../ducks/billMaterials";
import {default as routingReducer} from '../ducks/routing';
import {default as workCentersReducer} from '../ducks/workCenters';
import {default as operationCodesReducer} from '../ducks/operationCodes';
import {default as glAccountsReducer} from '../ducks/glAccounts';
import {default as dlCodesReducer} from '../ducks/dlCodes';
import {default as dlStepsReducer} from '../ducks/dlSteps';
import {default as timingsReducer} from '../ducks/timings';
import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import versionReducer from "../ducks/version";

export const rootReducer = combineReducers({
    alerts: alertsReducer,
    tkAlerts: tkAlertsReducer,
    billMaterials: billMaterialsReducer,
    dlCodes: dlCodesReducer,
    dlSteps: dlStepsReducer,
    glAccounts: glAccountsReducer,
    operationCodes: operationCodesReducer,
    pages: pagesReducer,
    routing: routingReducer,
    sortableTables: sortableTablesReducer,
    tabs: tabsReducer,
    timings: timingsReducer,
    workCenters: workCentersReducer,
    version: versionReducer
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
