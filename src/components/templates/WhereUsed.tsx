import {type ChangeEvent, useEffect, useId, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {LocalStore} from "@chumsinc/ui-utils";
import {localStorageKeys} from "@/api/preferences";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import {Button, Col, FormCheck, FormControl, InputGroup, ProgressBar, Row} from "react-bootstrap";
import {
    selectWhereUsedSearch,
    selectWhereUsedShowInactive,
    selectWhereUsedStatus,
    setSearch,
    setShowInactive
} from "@/ducks/where-used";
import {loadTemplateWhereUsed} from "@/ducks/where-used/actions";
import WhereUsedBillHeaderList from "@/components/templates/WhereUsedBillHeaderList";
import WhereUsedBillOptionHeaderList from "@/components/templates/WhereUsedBillOptionHeaderList";

export default function WhereUsed({templateNo}: {
    templateNo: string;
}) {
    const dispatch = useAppDispatch();
    const search = useAppSelector(selectWhereUsedSearch);
    const showInactive = useAppSelector(selectWhereUsedShowInactive);
    const status = useAppSelector(selectWhereUsedStatus);
    const [rowsPerPage, setRowsPerPage] = useState<number>(LocalStore.getItem(localStorageKeys.templateWURowsPerPage, 25));
    const showInactiveId = useId();
    const searchId = useId();

    useEffect(() => {
        dispatch(loadTemplateWhereUsed(templateNo));
    }, [dispatch, templateNo]);

    const rowsPerPageChangeHandler = (rpp: number) => {
        LocalStore.setItem(localStorageKeys.templateWURowsPerPage, rpp);
        setRowsPerPage(rpp);
    }

    const searchChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearch(ev.target.value));
    }

    const showInactiveChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setShowInactive(ev.target.checked))
    }

    const reloadHandler = () => {
        if (!templateNo) {
            return;
        }
        dispatch(loadTemplateWhereUsed(templateNo))
    }

    return (
        <AppErrorBoundary>
            <h3>Where Used</h3>
            <Row className="g-3">
                <Col xs="auto">
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={searchId} aria-label="Search Where Used">
                            <span className="bi-search" aria-hidden={true}/>
                        </InputGroup.Text>
                        <FormControl size="sm" id={searchId}
                                     value={search} onChange={searchChangeHandler}/>
                    </InputGroup>
                </Col>
                <Col xs="auto">
                    <FormCheck type="checkbox" id={showInactiveId} label="Show Inactive"
                               checked={showInactive} onChange={showInactiveChangeHandler}/>
                </Col>
                <Col/>
                <Col xs="auto">
                    <Button size="sm" onClick={reloadHandler}>Reload</Button>
                </Col>
            </Row>
            {status === 'loading' && <ProgressBar now={100} animated />}
            <WhereUsedBillHeaderList rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}/>
            <WhereUsedBillOptionHeaderList  rowsPerPage={rowsPerPage}  rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}/>
        </AppErrorBoundary>
    )
}
