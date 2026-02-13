import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import chatReducer from "./chatSlice";
import projectReducer from "./projectSlice";
import { rtkQueryErrorLogger } from "./middleware/errorLoger";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    projects: projectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQueryErrorLogger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
