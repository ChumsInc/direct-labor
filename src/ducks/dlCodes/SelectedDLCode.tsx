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
import {Alert, FormCheck, FormColumn, Input, InputGroup, SpinnerButton} from "chums-ducks";
import {DLCodeField, OperationCode, WorkCenter} from "../types";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import OperationCodeSelect from "../operationCodes/OperationCodeSelect";
import SelectedStepsList from "./SelectedStepsList";
import {newDLCode} from "./types";
import numeral from "numeral";

export interface SelectedDLCodeProps {
    id?: number,
}

const SelectedDLCode: React.FC<SelectedDLCodeProps> = ({id}) => {
    const dispatch = useDispatch();
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

    const onToggleActive = () => {
        dispatch(dlCodeChangedAction({active: !selected.active}));
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
        active,
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
            <h2>D/L Code Editor: <strong>{dlCode}</strong></h2>

            <form onSubmit={onSubmit}>
                <FormColumn label={"Direct Labor Code"}>
                    <div className="row g-3 align-items-baseline">
                        <div className="col-md-9">
                            <Input type="text" value={dlCode} onChange={changeHandler('dlCode')}/>
                        </div>
                        <div className="col-md-3">
                            <FormCheck label="Active" checked={active} onClick={onToggleActive} type="checkbox"/>
                        </div>
                    </div>
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
                <FormColumn label="Costs">
                    <div className="row g-3">
                        <div className="col-4">
                            <InputGroup>
                                <span className="input-group-text">Labor</span>
                                <Input type="text" value={numeral(laborBudget).format('$0,0.0000')} readOnly
                                       className="text-end"/>
                            </InputGroup>
                        </div>
                        <div className="col-4">
                            <InputGroup>
                                <span className="input-group-text">Fixed</span>
                                <Input type="text" value={numeral(fixedCosts).format('$0,0.0000')} readOnly
                                       className="text-end"/>
                            </InputGroup>
                        </div>
                        <div className="col-4">
                            <InputGroup>
                                <span className="input-group-text">Total</span>
                                <Input type="text" value={numeral(directLaborCost).format('$0,0.0000')} readOnly
                                       className="text-end"/>
                            </InputGroup>
                        </div>
                    </div>
                </FormColumn>
                <FormColumn label="Last Updated">
                    {!!timestamp ? new Date(timestamp).toLocaleString() : ''}
                </FormColumn>


                <div className="row g-3 mt-3">
                    <div className="col-auto">
                        <SpinnerButton type="submit" spinning={saving} disabled={loading || saving} size="sm"
                                       spinnerAfter>
                            Save
                        </SpinnerButton>
                    </div>
                    <div className="col-auto">
                        <SpinnerButton type="button" color="danger"
                                       disabled={loading || saving || !!steps.length || !selected.id} size="sm"
                                       onClick={() => window.alert('Not implemented yet.')}
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
            <hr/>
            <SelectedStepsList/>
        </div>
    )
}

export default SelectedDLCode;
