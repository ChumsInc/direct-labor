import DLCodeFilter from "@/components/direct-labor-codes/list/DLCodeFilter.tsx";
import MainDLCodeList from "@/components/direct-labor-codes/list/MainDLCodeList.tsx";
import DocumentTitle from "@/components/common/DocumentTitle.tsx";

export default function DirectLaborCodes() {
    return (
        <div>
            <DocumentTitle>D/L Activity Codes</DocumentTitle>
            <DLCodeFilter/>
            <MainDLCodeList/>
        </div>
    )
}

