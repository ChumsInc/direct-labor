import {DLCode, dlCodeKey, DLCodeList, DLCodesThunkAction} from "./types";
import {fetchJSON} from "chums-ducks";
import {useSelector} from "react-redux";
import {loadDLCodesFailed, loadDLCodesRequested, loadDLCodesSucceeded, loadingSelector} from "./index";

const dlCodesListURL = (dlCode?:string) => `/api/operations/production/dl/codes/list/${encodeURIComponent(dlCode || '')}`;
const dlCodeURL = (dlCode:string|number) => `/api/operations/production/dl/codes/${encodeURIComponent(dlCode)}`;

export const loadDLCodesAction = (): DLCodesThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = loadingSelector(state);
            if (loading) {
                return;
            }
            dispatch({type: loadDLCodesRequested});
            const url = dlCodesListURL();
            const {dlCodes} = await fetchJSON(url, {cache: 'no-cache'});
            const list:DLCodeList = {};
            dlCodes.forEach((row:DLCode) => list[dlCodeKey(row)] = row);
            dispatch({type:loadDLCodesSucceeded, payload: {list} })
        } catch(err) {
            console.log("()", err.message);
            dispatch({type: loadDLCodesFailed, payload: {error: err, context: loadDLCodesRequested}});
        }
    }
