import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import messageReducer from "./messageSlice.js";
import socketReducer from "./socketSlice.js";
import {
    persistReducer,
    createTransform,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
  import storage from 'redux-persist/lib/storage'

  const userOnlyTransform = createTransform(
    (inboundState, key) => key === 'user' ? { authUser: inboundState.authUser } : inboundState,
    (outboundState) => ({
      authUser: outboundState?.authUser || null,
      otherUsers: null,
      selectedUser: null,
      onlineUsers: [],
      unreadByUser: {},
    }),
    { whitelist: ['user'] }
  );

  const persistConfig = {
    key: 'root',
    version: 2,
    storage,
    whitelist: ['user'],
    transforms: [userOnlyTransform],
  }

  const rootReducer = combineReducers({
    user:userReducer,
    message:messageReducer,
    socket:socketReducer
 })

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['socket.socket'],
      },
    }),
});
export default store;
