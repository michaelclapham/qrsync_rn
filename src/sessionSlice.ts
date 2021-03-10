import { createAction, createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { ServerTypes } from './ServerTypes';
import { AppThunk, RootState } from './store';
import { receivedClientJoinedSession } from './websocketSlice';

export interface SessionState {
    sessionId: string | null;
}

const initialState: SessionState = {
    sessionId: null
};

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(receivedClientJoinedSession, (state, action) => {
            if (action.payload.ourClient && action.payload.msg.clientId === action.payload.ourClient.id) {
                state.sessionId = action.payload.msg.sessionId;
            }
        });
    }
});

export const sessionReducer = sessionSlice.reducer;
