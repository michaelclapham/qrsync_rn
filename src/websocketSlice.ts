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
        receivedWSMessage: (state, action: PayloadAction<{ msg: ServerTypes.Msg, ourClient: ServerTypes.Client | null }>) => {
            switch (action.payload.msg.type) {
                case "ClientConnect": {
                    state.ourClient = action.payload.msg.client;
                    break;
                }
            }
        }
    }
});

export const { connected, disconnected, receivedWSMessage } = websocketSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(connectToWebsocket())`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const connectToWebsocket: (url: string) => AppThunk = (url: string) => (dispatch, getState) => {
    if (ws) {
        ws.close();
    }
    ws = new WebSocket(url);
    ws.onopen = () => {
        dispatch(connected());
    }
    ws.onmessage = (event) => {
        console.log("WS Event", event);
        const msg: ServerTypes.Msg = JSON.parse(event.data);
        const ourClient = getState().websocket.ourClient;
        dispatch(receivedWSMessage({ msg, ourClient }))
    };
    ws.onclose = () => {
        dispatch(disconnected());
    }
};

export const sendWSMessage: (msg: ServerTypes.Msg) => AppThunk = (msg) => (dispatch, getState) => {
    if (ws.readyState === WebSocket.OPEN) {
        const body = JSON.stringify(msg);
        ws.send(body);
    }
};

export const selectOurClient = (state: RootState) => state.websocket.ourClient;

export const websocketReducer = websocketSlice.reducer;
