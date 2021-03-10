import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { sessionReducer } from './sessionSlice';
import { websocketReducer } from './websocketSlice';

export const store = configureStore({
  reducer: {
    websocket: websocketReducer,
    session: sessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
