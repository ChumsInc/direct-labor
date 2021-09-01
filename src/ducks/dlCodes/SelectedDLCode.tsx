import React, {ChangeEvent, FormEvent, useEffect} from "react";
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {
    dlCodeSelector,
    loadedSelector,
    selectedChangedSelector,
    selectedHeaderSelector,
    selectedLoadingSelector,
    selectedSavingSelector,
    selectedStepsSelector
} from "./selectors";
import {dlCodeChangedAction, loadDLCodeAction, saveDLCodeAction} from "./actions";
import {Helmet} from "react-helmet";
import {Alert, FormColumn, Input, SpinnerButton} from "chums-ducks";
import {DLCodeField, OperationCode, WorkCenter} from "../types";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import OperationCodeSelect from "../operationCodes/OperationCodeSelect";
import SelectedStepsList from "./SelectedStepsList";
import {newDLCode} from "./types";
import {saveDLCodeRequested} from "./actionTypes";

export interface SelectedDLCodeProps {
    id?: number,
}

const SelectedDLCode: React.FC<SelectedDLCodeProps> = ({id}) => {
    const dispatch = useDispatch();
    const selectedLoading = useSelector(selectedLoadingSelector);
    const loading = useSelector(selectedLoadingSelector);
    const saving = useSelector(selectedSavingSelector);
    const loaded = useSelector(loadedSelector);
    const selected = useSelector(selectedHeaderSelector);
    const steps = useSelector(selectedStepsSelector);
    const navDLCode = useSelector(dlCodeSelector(id || 0));
    const changed = useSelector(selectedChangedSelector);

    useEffect(() => {
        if (id === 0 && selected?.id !== id) {
            dispatch(loadDLCodeAction(newDLCode));
            return;
        }
        if (id && selected?.id !== id && navDLCode) {
            dispatch(loadDLCodeAction(navDLCode));
        }
    }, [id, loaded]);

    if (!selected) {
        return (
            <Alert color="info">Select a D/L Code</Alert>
        )
    }
    const changeHandler = (field: DLCodeField) => (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(dlCodeChangedAction({[field]: ev.target.value}));
    }
    const onChangeWorkCenter = (wc: WorkCenter | null) => {
        dispatch(dlCodeChangedAction({workCenter: wc?.WorkCenterCode || ''}));
    }

    const onChangeOperationCode = (oc: OperationCode | null) => {
        dispatch(dlCodeChangedAction({
            workCenter: oc?.WorkCenter || workCenter,
            operationCode: oc?.OperationCode || ''
        }));
    }

    const onReload = () => {
        dispatch(loadDLCodeAction(selected));
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveDLCodeAction(selected));
    }

    const {
        dlCode,
        operationCode,
        description,
        directLaborCost,
        laborBudget,
        fixedCosts,
        StdRatePiece,
        standardAllowedMinutes,
        workCenter,
        timestamp
    } = selected;

    return (
        <div>
            <Helmet>
                <title>D/L Code: {dlCode}</title>
            </Helmet>
            <form onSubmit={onSubmit}>
                <FormColumn label={"Direct Labor Code"}>
                    <Input type="text" value={dlCode} onChange={changeHandler('dlCode')}/>
                </FormColumn>
                <FormColumn label={"Description"}>
                    <Input type="text" value={description} onChange={changeHandler('description')}/>
                </FormColumn>
                <FormColumn label="Sage Operation">
                    <div className="row g-3">
                        <div className="col-6">
                            <WorkCenterSelect value={workCenter} onSelectWorkCenter={onChangeWorkCenter}/>
                        </div>
                        <div className="col-6">
                            <OperationCodeSelect operationCode={operationCode} workCenter={workCenter}
                                                 onChange={onChangeOperationCode}/>
                        </div>
                    </div>
                </FormColumn>

                <div className="row g-3 mt-3">
                    <div className="col-auto">
                        <SpinnerButton type="submit" spinning={saving} disabled={loading || saving} size="sm"
                                       spinnerAfter>
                            Save
                        </SpinnerButton>
                    </div>
                    <div className="col-auto">
                        <SpinnerButton type="button" spinning={saving} color="danger"
                                       disabled={loading || saving || !!steps.length || !selected.id} size="sm"
                                       spinnerAfter>
                            Delete DL Code
                        </SpinnerButton>

                    </div>
                    <div className="col-auto">
                        <Link to="/dl-codes/0" className="btn btn-sm btn-outline-secondary">New DL Code</Link>
                    </div>
                    <div className="col-auto">
                        <SpinnerButton type="button" spinning={loading} disabled={loading || saving} size="sm"
                                       color="secondary"
                                       onClick={onReload} spinnerAfter>
                            Reload
                        </SpinnerButton>
                    </div>
                </div>
            </form>
            {changed && <Alert color="warning">Don't forget to save your changes.</Alert>}
            <SelectedStepsList/>

            <hr/>
            <pre>
                <code>{JSON.stringify(selected, undefined, 2)}</code>
            </pre>
        </div>
    )
}

export default SelectedDLCode;
