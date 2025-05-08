import {combineReducers} from "redux";
import {default as billMaterialsReducer} from "../ducks/billMaterials";
import {default as routingReducer} from '../ducks/routing';
import {default as workCentersReducer} from '../ducks/workCenters';
import {default as operationCodesReducer} from '../ducks/operationCodes';
import {default as glAccountsReducer} from '../ducks/glAccounts';
import {default as dlCodesReducer} from '../ducks/dlCodes';
import {default as dlStepsSlice} from '../ducks/dlSteps';
import {default as timingsReducer} from '../ducks/timings';
import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import versionReducer from "../ducks/version";
import activityCodesReducer from "../ducks/activity-codes";
import templatesReducer from "../ducks/templates";
import {alertsSlice} from "@chumsinc/alert-list";

export const rootReducer = combineReducers({
    activityCodes: activityCodesReducer,
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    billMaterials: billMaterialsReducer,
    dlCodes: dlCodesReducer,
    [dlStepsSlice.reducerPath]: dlStepsSlice.reducer,
    glAccounts: glAccountsReducer,
    operationCodes: operationCodesReducer,
    routing: routingReducer,
    templates: templatesReducer,
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
