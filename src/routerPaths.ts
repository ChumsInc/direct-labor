export const routingNavId = 'routing';
export const routingPath = '/routing';
export const selectedRoutingPath = (routingNo: string) => `/routing/${encodeURIComponent(routingNo)}`;
export const routingRouterPath = '/routing/:routingNo?';

export const workCentersNavId = 'work-centers';
export const workCentersPath = '/work-centers';
export const selectedWorkCenterPath = (workCenter: string) => `/work-centers/${encodeURIComponent(workCenter)}`;
export const workCenterRouterPath = `/work-centers/:workCenter?`;

export const operationCodesNavId = 'operation-codes';
export const operationCodesPath = '/operation-codes';
export const operationCodesWCPath = (workCenter: string) => `/operation-codes/${encodeURIComponent(workCenter)}`;
export const operationCodesOperationPath = (workCenter: string, operationCode: string) => `/operation-codes/${encodeURIComponent(workCenter)}/${encodeURIComponent(operationCode)}`;
export const operationCodesRouterPath = '/operation-codes/:workCenter?/:operationCode?';

export const dlCodesNavId = 'dl-codes';
export const dlCodesPath = '/dl-codes';
export const dlCodePath = (id: number) => `/dl-codes/${encodeURIComponent(id)}`;
export const dlCodesRouterPath = '/dl-codes/:id?';

export const dlStepsNavId = 'dl-steps';
export const dlStepsPath = '/dl-steps';
export const dlStepPath = (id: number) => `/dl-steps/${encodeURIComponent(id)}`;
export const dlStepsRouterPath = '/dl-steps/:id?';
