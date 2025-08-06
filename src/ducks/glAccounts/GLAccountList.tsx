interface GLAccountListProps {
    tableKey: string,
    accountKeys: string[]
}

const GLAccountList = ({tableKey, accountKeys}: GLAccountListProps) => {
    return (
        <div data-table-key={tableKey}>{accountKeys.join(';')}</div>
    )
}

export default GLAccountList;
