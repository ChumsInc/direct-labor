import React from "react";
import {useSelector} from "react-redux";
import {glAccountSelector} from "./index";

export interface GLAccountElementProps {
    accountKey: string,
    showDescription: boolean,
}

const GLAccountElement:React.FC<GLAccountElementProps> = ({accountKey, showDescription}) => {
    const glAccount = useSelector(glAccountSelector(accountKey));
    if (!glAccount) {
        return null;
    }
    return (
        <div>
            <strong>{glAccount.Account}</strong>
            {' '}
            {showDescription && (<span>{glAccount.AccountDesc}</span>)}
        </div>
    )
}
export default GLAccountElement;
