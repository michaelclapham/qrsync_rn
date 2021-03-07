import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from './store';

interface Client {
  id: string;
  name: string;
}

interface SessionState {
  id: string | null;
  clients: Client[];
}

const initialState: SessionState = {
  id: null,
  clients: []
};

export const counterSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    }
  },
});

export const { setSessionId } = counterSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(setSessionIdAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const setSessionIdAsync = (id: string): AppThunk => dispatch => {
  setTimeout(() => {
    dispatch(setSessionId(id));
  }, 1000);
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectSessionId = (state: RootState) => state.session.id;

export const sessionReducer = counterSlice.reducer;
