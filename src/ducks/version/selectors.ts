import type {RootState} from "@/app/configureStore";

export const selectVersion = (state:RootState) => state.version.version;
export const selectVersionLoading = (state:RootState) => state.version.loading;
