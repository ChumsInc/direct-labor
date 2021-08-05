import React from "react";

interface GLAccountListProps {
    tableKey: string,
    accountKeys: string[]
}

const GLAccountList:React.FC<GLAccountListProps> = ({tableKey, accountKeys}) => {
    return (
        <div>{accountKeys.join(';')}</div>
    )
}

export default GLAccountList;
