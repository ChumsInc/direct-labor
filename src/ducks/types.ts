export interface ListState {
    list: any[] | object,
    selected: any,
    loading: boolean,
    loaded: boolean,
    filter: string,
}

export const defaultListState:ListState = {
    list: [],
    selected: null,
    loading: false,
    loaded: false,
    filter: '',
}

export interface ActionInterfacePayload {
    list?: any[] | object,
    filter?: string,
    error?: Error,
    context?: string,
}
