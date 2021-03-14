import { createAction, createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { ServerTypes } from './ServerTypes';
import { AppThunk, RootState } from './store';
import { receivedWSMessage, sendWSMessage } from './websocketSlice';

export interface SessionState {
    sessionId: string | null;
    clientMap: Record<string, ServerTypes.Client>;
}

const initialState: SessionState = {
    sessionId: null,
    clientMap: {}
};

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(receivedWSMessage, (state, action) => {
            const { msg, ourClient } = action.payload;
            switch (msg.type) {
                case "ClientJoinedSession": {
                    if (ourClient && msg.clientId === ourClient.id) {
                        state.sessionId = msg.sessionId;
                    }
                    state.clientMap = msg.clientMap;
                    return;
                }
                case "ClientLeftSession": {
                    if (!ourClient || ourClient && msg.clientId === ourClient.id) {
                        state.sessionId = null;
                        state.clientMap = {};
                    }
                    state.clientMap = msg.clientMap;
                }
            }
        });
    }
});

export const scanClientId: (id: string) => AppThunk = (id) => (dispatch, getState) => {
    const sessionId = getState().websocket.sessionId;
    if (!sessionId) {
        const createSessionMsg: ServerTypes.CreateSessionMsg = {
            type: "CreateSession",
            addClientId: id
        };
        dispatch(sendWSMessage(createSessionMsg));
    } else {
        const addSessionClientMsg: ServerTypes.AddSessionClientMsg = {
            type: "AddSessionClient",
            addClientId: id,
            sessionId: sessionId
        };
        dispatch(sendWSMessage(addSessionClientMsg))
    }
};

export const selectClientMap = (state: RootState) => state.session.clientMap;

export const selectSessionId = (state: RootState) => state.session.sessionId;

export const sessionReducer = sessionSlice.reducer;
