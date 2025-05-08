import React from 'react';
import {Navigate} from "react-router";

export default function Redirect({to}:{to: string}) {
    return (
        <Navigate to={to} />
    )
}
