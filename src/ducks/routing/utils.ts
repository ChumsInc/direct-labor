import type {RoutingDetail, RoutingHeader, SortProps} from "chums-types";

export const routingHeaderKey = (header: RoutingHeader) => header.RoutingNo;
export const routingDetailKey = (detail: RoutingDetail) => [detail.RoutingNo, detail.StepNo].join(':');

export const routingHeaderSorter = ({field, ascending}: SortProps<RoutingHeader>) =>
    (a: RoutingHeader, b: RoutingHeader): number => {
        const sortMod = ascending ? 1 : -1;
        switch (field) {
            case 'RoutingNo':
            case 'StepDescription':
                return (
                    a[field] === b[field]
                        ? (routingHeaderKey(a) > routingHeaderKey(b) ? 1 : -1)
                        : (a[field] > b[field] ? 1 : -1)
                ) * sortMod;
            case "ItemStatus":
            case 'BillStatus':
            case 'StandardRateTotal':
                return (
                    +a[field] === +b[field]
                    ? (routingHeaderKey(a) > routingHeaderKey(b) ? 1 : -1)
                        : (+a[field] > +b[field] ? 1 : -1)
                ) * sortMod;
            default:
                return (routingHeaderKey(a) > routingHeaderKey(b) ? 1 : -1) * sortMod;
        }
    };

export const routingDetailSorter = ({field, ascending}: SortProps<RoutingDetail>) =>
    (a: RoutingDetail, b: RoutingDetail): number => {
        const sortMod = ascending ? 1 : -1;
        switch (field) {
            case 'RoutingNo':
            case 'OperationCode':
            case 'OperationDescription':
            case 'StepNo':
            case 'WorkCenter':
                return (
                    a[field] === b[field]
                        ? (routingDetailKey(a) > routingDetailKey(b) ? -1 : 1)
                        : (a[field] > b[field] ? 1 : -1)
                ) * sortMod;
            case 'PlannedPieceCostDivisor':
            case 'StdRatePiece':
                return (
                    a[field] === b[field]
                        ? (routingDetailKey(a) > routingDetailKey(b) ? -1 : 1)
                        : (a[field] - b[field])
                ) * sortMod;
            default:
                return (routingDetailKey(a) > routingDetailKey(b) ? -1 : 1) * sortMod;

        }
    };
