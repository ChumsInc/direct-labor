import React from "react";

export interface MultiLineFieldProps {
    line1: string,
    line2: string|null,
}

const MultiLineField:React.FC<MultiLineFieldProps> = ({line1, line2}) => {
    return (
        <>
            <div>{line1}</div>
            {!!line2 && (<small>{line2}</small>)}
        </>
    )

}

export default MultiLineField;
