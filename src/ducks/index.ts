import {combineReducers} from 'redux';
import {alertsReducer, pagesReducer, sortableTablesReducer, tabsReducer} from 'chums-ducks';
import {default as routingReducer} from './routing';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    pages: pagesReducer,
    sortableTables: sortableTablesReducer,
    tabs: tabsReducer,
    routing: routingReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
