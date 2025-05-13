import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCurrentTemplate, selectCurrentTemplateStatus, selectCurrentTemplateSteps} from "./selectors";
import AnimatedLoadingBar from "../../components/AnimatedLoadingBar";
import {useParams} from "react-router";
import {loadTemplate} from "./actions";
import CurrentTemplateSteps from "./CurrentTemplateSteps";
import numeral from "numeral";
import dayjs from "dayjs";
import FormColumn from "@/components/common/FormColumn";
import DocumentTitle from "@/components/common/DocumentTitle";


const CurrentTemplate = () => {
    const dispatch = useAppDispatch();
    const template = useAppSelector(selectCurrentTemplate);
    const steps = useAppSelector(selectCurrentTemplateSteps)
    const loading = useAppSelector(selectCurrentTemplateStatus);
    const params = useParams<'templateNo' | 'revisionNo'>();

    useEffect(() => {
        if (params.templateNo !== template?.TemplateNo || params.revisionNo !== template?.RevisionNo) {
            dispatch(loadTemplate({
                TemplateNo: params.templateNo ?? '',
                RevisionNo: params.revisionNo ?? '',
            }))
        }
    }, [params]);

    if (!template) {
        return null;
    }

    return (
        <div>
            <DocumentTitle>{`W/T Template: ${template.TemplateNo}:${template.RevisionNo}`}</DocumentTitle>
            <div className="card mb-3">
                <div className="card-header">
                    <h3>W/T Template: {template.TemplateNo}:{template.RevisionNo}</h3>
                </div>
                <div className="card-body">
                    <h4>{template.TemplateDesc}</h4>
                    <AnimatedLoadingBar loading={loading !== 'idle'}/>
                    <FormColumn label="Cost">
                        <input type="text" readOnly className="form-control form-control-plaintext"
                               value={numeral(template.TemplateCost).format('$0,0.0000')}/>
                    </FormColumn>
                    <FormColumn label="Updated">
                        <input type="text" readOnly className="form-control form-control-plaintext"
                               value={dayjs(template.updated).isValid() ? dayjs(template.updated).toDate().toLocaleString() : '-'}/>
                    </FormColumn>
                </div>
            </div>
            <CurrentTemplateSteps/>
            <code>
                <pre>{JSON.stringify(template, undefined, 2)}</pre>
                <pre>{JSON.stringify(steps, undefined, 2)}</pre>
            </code>
        </div>
    )
}

export default CurrentTemplate;
