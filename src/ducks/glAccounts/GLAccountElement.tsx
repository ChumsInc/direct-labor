import React from "react";
import {selectGLByAccountKey} from "./index";
import {useAppSelector} from "../../app/configureStore";

export interface GLAccountElementProps {
    accountKey: string,
    showDescription: boolean,
}

const GLAccountElement = ({accountKey, showDescription}: GLAccountElementProps) => {
    const glAccount = useAppSelector((state) => selectGLByAccountKey(state, accountKey));
    if (!glAccount) {
        return null;
    }
    return (
        <div className="d-flex justify-content-start">
            <div><strong>{glAccount.Account}</strong></div>
            {showDescription && (<div className="ms-5">{glAccount.AccountDesc}</div>)}
        </div>
    )
}
export default GLAccountElement;
