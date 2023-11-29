import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import localStorage from "redux-persist/lib/storage";

import authSlice from "./slices/authSlice";
import settingsSlice from "./slices/settingsSlice";
import teacherSlice from "./slices/teacherSlice";
import cartSlice from "./slices/cartSlice";
import wishlistSlice from "./slices/wishlistSlice";
import subscriptionSlice from "./slices/subscriptionSlice";

const persistConfig = {
  key: "root",
  storage: localStorage,
  whitelist: ["auth"],
};
const rootReducer = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  wishlist: wishlistSlice,
  teacher: teacherSlice,
  subscription: subscriptionSlice,
  settings: settingsSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
