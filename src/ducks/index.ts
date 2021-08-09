import {combineReducers} from 'redux';
import {alertsReducer, pagesReducer, sortableTablesReducer, tabsReducer} from 'chums-ducks';
import {default as routingReducer} from './routing';
import {default as workCentersReducer} from './workCenters';
import {default as operationCodesReducer} from './operationCodes';
import {default as glAccountsReducer} from './glAccounts';
import {default as billMaterialsReducer} from './billMaterials';
import {default as dlCodesReducer} from './dlCodes';

const rootReducer = combineReducers({
    // app: appReducer,
    alerts: alertsReducer,
    billMaterials: billMaterialsReducer,
    dlCodes: dlCodesReducer,
    glAccounts: glAccountsReducer,
    operationCodes: operationCodesReducer,
    pages: pagesReducer,
    routing: routingReducer,
    sortableTables: sortableTablesReducer,
    tabs: tabsReducer,
    workCenters: workCentersReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
