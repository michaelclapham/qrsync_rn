import { createAction, createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { ServerTypes } from './ServerTypes';
import { AppThunk, RootState } from './store';

let ws: WebSocket;

export interface WebsocketState {
    connected: boolean;
    ourClient: ServerTypes.Client | null;
    allMessages: ServerTypes.Msg[];
    sessionId: string | null;
}

const initialState: WebsocketState = {
    connected: false,
    ourClient: null,
    sessionId: null,
    allMessages: []
};

export const websocketSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
        connected: state => {
            state.connected = true;
        },
        disconnected: state => {
            state.connected = false;
            state.ourClient = null;
        },
        receivedClientConnect: (state, action: PayloadAction<ServerTypes.ClientConnectMsg>) => {
            state.ourClient = action.payload.client;
        },
        receivedClientJoinedSession: (state, action: PayloadAction<{ msg: ServerTypes.ClientJoinedSessionMsg, ourClient: ServerTypes.Client | null }>) => {
        }
    }
});

export const { connected, disconnected, receivedClientJoinedSession, receivedClientConnect } = websocketSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(connectToWebsocket())`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const connectToWebsocket: AppThunk = (dispatch, getState) => {
    if (ws) {
        ws.close();
    }
    ws = new WebSocket("wss://qrsync.org/api/v1/ws");
    ws.onopen = () => {
        dispatch(connected());
    }
    ws.onmessage = (event) => {
        console.log("ws event", event);
        const msg: ServerTypes.Msg = JSON.parse(event.data);
        switch (msg.type) {
            case "ClientConnect": {
                dispatch(receivedClientConnect(msg));
                break;
            }
            case "ClientJoinedSession": {
                const ourClient = getState().websocket.ourClient;
                dispatch(receivedClientJoinedSession({msg, ourClient}));
                break;
            }
        }
    };
    ws.onclose = () => {
        dispatch(disconnected());
    }
};

export const selectOurClient = (state: RootState) => state.websocket.ourClient;

export const websocketReducer = websocketSlice.reducer;
