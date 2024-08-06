import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import {useSelector} from "react-redux";
import {selectCurrentChanged, selectCurrentDLCodeStatus, selectCurrentHeader, selectCurrentSteps} from "./selectors";
import {loadDLCode, rebuildDLCode, saveDLCode} from "./actions";
import {Helmet} from "react-helmet";
import {Alert, FormCheck, FormColumn, Input, InputGroup, SpinnerButton} from "chums-components";
import {DLCode, Editable, OperationCode, WorkCenter} from 'chums-types'
import WorkCenterSelect from "../workCenters/WorkCenterSelect";
import OperationCodeSelect from "../operationCodes/OperationCodeSelect";
import SelectedStepsList from "./SelectedStepsList";
import {newDLCode} from "./utils";
import numeral from "numeral";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import DLCodeSageRate from "./DLCodeSageRate";
import CurrentDLCodeTemplates from "./CurrentDLCodeTemplates";


const CurrentDLCode = () => {
    const dispatch = useAppDispatch();
    const params = useParams<'id'>();
    const status = useAppSelector(selectCurrentDLCodeStatus);
    const selected = useSelector(selectCurrentHeader);
    const steps = useSelector(selectCurrentSteps);
    const changed = useSelector(selectCurrentChanged);
    const [current, setCurrent] = useState<DLCode & Editable>({...(selected ?? newDLCode)})

    useEffect(() => {
        if (!params.id) {
            return;
        }
        dispatch(loadDLCode(params.id));
    }, [params])

    useEffect(() => {
        if (selected) {
            return setCurrent({...selected})
        }
        setCurrent({...newDLCode});
    }, [selected]);

    if (!current) {
        return (
            <Alert color="info">Select a D/L Code</Alert>
        )
    }
    const changeHandler = (field: keyof DLCode) => (ev: ChangeEvent<HTMLInputElement>) => {
        setCurrent({...current, [field]: ev.target.value, changed: true});
    }
    const onChangeWorkCenter = (wc: WorkCenter | null) => {
        setCurrent({...current, workCenter: wc?.workCenter ?? '', changed: true});

    }

    const onChangeOperationCode = (oc: OperationCode | null) => {
        setCurrent({...current, operationCode: oc?.OperationCode ?? '', changed: true})
    }

    const onToggleActive = (ev: ChangeEvent<HTMLInputElement>) => {
        setCurrent({...current, active: ev.target.checked, changed: true});
    }

    const onReload = () => {
        if (!selected || changed || !selected.id) {
            return;
        }
        dispatch(rebuildDLCode(selected.id));
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveDLCode(current));
    }

    return (
        <div>
            <Helmet>
                <title>D/L Code: {current.dlCode}</title>
            </Helmet>


            <div className="card">
                <div className="card-header">
                    <h2>D/L Code Editor: <strong>{current.dlCode}</strong></h2>
                </div>
                <div className="card-body">
                    <form onSubmit={onSubmit}>
                        <FormColumn label={"Direct Labor Code"} width={9}>
                            <div className="row g-3 align-items-baseline">
                                <div className="col-md-9">
                                    <Input type="text" value={current.dlCode} onChange={changeHandler('dlCode')}/>
                                </div>
                                <div className="col-md-3">
                                    <FormCheck label="Active" checked={current.active} onChange={onToggleActive}
                                               type="checkbox"/>
                                </div>
                            </div>
                        </FormColumn>
                        <FormColumn label={"Description"} width={9}>
                            <Input type="text" value={current.description} onChange={changeHandler('description')}/>
                        </FormColumn>
                        <FormColumn label="Sage Activity" width={9}>
                            <div className="row g-3">
                                <div className="col-6">
                                    <WorkCenterSelect value={current.workCenter} required
                                                      onSelectWorkCenter={onChangeWorkCenter}/>
                                </div>
                                <div className="col-6">
                                    <OperationCodeSelect operationCode={current.operationCode}
                                                         workCenter={current.workCenter}
                                                         onChange={onChangeOperationCode}/>
                                </div>
                            </div>
                        </FormColumn>
                        <FormColumn label="Costs" width={9}>
                            <div className="row g-3">
                                <div className="col-4">
                                    <InputGroup>
                                        <span className="input-group-text">Labor</span>
                                        <Input type="text" value={numeral(current.laborBudget).format('$0,0.0000')}
                                               readOnly
                                               className="text-end"/>
                                    </InputGroup>
                                </div>
                                <div className="col-4">
                                    <InputGroup>
                                        <span className="input-group-text">Fixed</span>
                                        <Input type="text" value={numeral(current.fixedCosts).format('$0,0.0000')}
                                               readOnly
                                               className="text-end"/>
                                    </InputGroup>
                                </div>
                                <div className="col-4">
                                    <InputGroup>
                                        <span className="input-group-text">Total</span>
                                        <Input type="text" value={numeral(current.directLaborCost).format('$0,0.0000')}
                                               readOnly
                                               className="text-end"/>
                                    </InputGroup>
                                </div>
                            </div>
                        </FormColumn>
                        <FormColumn label="Last Updated" width={9}>
                            {!!current.timestamp &&
                                <input type="text" className="form-control form-control-plaintext"
                                       defaultValue={new Date(current.timestamp).toLocaleString()}/>}
                        </FormColumn>
                        <FormColumn label="Sage Template Data" width={9}>
                            <DLCodeSageRate/>
                        </FormColumn>


                        <div className="row g-3 mt-3">
                            <div className="col"></div>
                            <div className="col-auto">
                                <SpinnerButton type="button" color="danger"
                                               disabled={status !== 'idle' || !!steps.length || !current.id} size="sm"
                                               onClick={() => window.alert('Not implemented yet.')}>
                                    Delete DL Code
                                </SpinnerButton>

                            </div>
                            <div className="col-auto">
                                <Link to="/dl-codes/0" className="btn btn-sm btn-outline-secondary">New DL Code</Link>
                            </div>
                            <div className="col-auto">
                                <SpinnerButton type="button" spinning={status === 'loading'}
                                               disabled={status !== 'idle'} size="sm"
                                               color="secondary"
                                               onClick={onReload}>
                                    Rebuild Cost
                                </SpinnerButton>
                            </div>
                            <div className="col-auto">
                                <SpinnerButton type="submit" spinning={status === 'saving'} disabled={status !== 'idle'}
                                               size="sm">
                                    Save
                                </SpinnerButton>
                            </div>
                        </div>
                        {changed && <Alert color="warning">Don't forget to save your changes.</Alert>}
                    </form>
                </div>
                <hr/>
                <div className="card-body">
                    <h3>Steps</h3>
                    {!!selected?.id && <SelectedStepsList/>}
                </div>
                <hr/>
                <div className="card-body">
                    <h3>Where Used in Templates</h3>
                    <CurrentDLCodeTemplates/>
                </div>
            </div>
        </div>
    )
}

export default CurrentDLCode;
