import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import {useSelector} from "react-redux";
import {
    selectCurrentChanged,
    selectCurrentHeader,
    selectCurrentLoading,
    selectCurrentSaving,
    selectCurrentSteps,
    selectDLCodeByID,
    selectLoaded
} from "./selectors";
import {loadDLCode, rebuildDLCode, saveDLCode} from "./actions";
import {Helmet} from "react-helmet";
import {Alert, FormColumn, Input, InputGroup, SpinnerButton} from "chums-components";
import {Editable} from 'chums-types'
import {DLCode, DLCodeField, OperationCode, WorkCenter} from "../types";
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import OperationCodeSelect from "../operationCodes/OperationCodeSelect";
import SelectedStepsList from "./SelectedStepsList";
import {newDLCode} from "./types";
import numeral from "numeral";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {FormCheck} from "chums-components";

export interface SelectedDLCodeProps {
    id?: number,
}

const SelectedDLCode: React.FC<SelectedDLCodeProps> = ({id}) => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectCurrentLoading);
    const saving = useSelector(selectCurrentSaving);
    const loaded = useSelector(selectLoaded);
    const selected = useSelector(selectCurrentHeader);
    const steps = useSelector(selectCurrentSteps);
    const navDLCode = useAppSelector((state) => selectDLCodeByID(state, id || 0));
    const changed = useSelector(selectCurrentChanged);
    const [DLCode, setDLCode] = useState<DLCode & Editable>({...(selected ?? newDLCode)})

    useEffect(() => {
        if (id === 0 && selected?.id !== id) {
            setDLCode({...newDLCode});
            return;
        }
        if (id && selected?.id !== id && navDLCode) {
            dispatch(loadDLCode(navDLCode));
        }
    }, [id, loaded]);

    if (!selected) {
        return (
            <Alert color="info">Select a D/L Code</Alert>
        )
    }
    const changeHandler = (field: DLCodeField) => (ev: ChangeEvent<HTMLInputElement>) => {
        setDLCode({...DLCode, [field]: ev.target.value, changed: true});
    }
    const onChangeWorkCenter = (wc: WorkCenter | null) => {
        setDLCode({...DLCode, workCenter: wc?.WorkCenterCode ?? '', changed: true});

    }

    const onChangeOperationCode = (oc: OperationCode | null) => {
        setDLCode({...DLCode, operationCode: oc?.OperationCode ?? '', changed: true})
    }

    const onToggleActive = (ev: ChangeEvent<HTMLInputElement>) => {
        setDLCode({...DLCode, active: ev.target.checked, changed: true});
    }

    const onReload = () => {
        if (!selected || selected.changed || !selected.id) {
            return;
        }
        dispatch(rebuildDLCode(selected.id));
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveDLCode(DLCode));
    }

    const {
        dlCode,
        operationCode,
        description,
        active,
        directLaborCost,
        laborBudget,
        fixedCosts,
        workCenter,
        timestamp
    } = selected;

    return (
        <div>
            <Helmet>
                <title>D/L Code: {DLCode.dlCode}</title>
            </Helmet>
            <h2>D/L Code Editor: <strong>{DLCode.dlCode}</strong></h2>

            <form onSubmit={onSubmit}>
                <FormColumn label={"Direct Labor Code"}>
                    <div className="row g-3 align-items-baseline">
                        <div className="col-md-9">
                            <Input type="text" value={dlCode} onChange={changeHandler('dlCode')}/>
                        </div>
                        <div className="col-md-3">
                            <FormCheck label="Active" checked={active} onChange={onToggleActive} type="checkbox"/>
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
                            Rebuild Cost
                        </SpinnerButton>
                    </div>
                </div>
            </form>
            {changed && <Alert color="warning">Don't forget to save your changes.</Alert>}
            <hr/>
            {!!selected?.id && <SelectedStepsList/>}
        </div>
    )
}

export default SelectedDLCode;
