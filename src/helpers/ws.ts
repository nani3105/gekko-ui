import Vue from 'vue';
import initializeState from '@/store//init';
import { wsPath } from '@/helpers/api';

let socket = null;

export const bus = new Vue();

const info = {
  connected: false,
};

export const connect = () => {
  socket = new (window as any).ReconnectingWebSocket(wsPath);

  setTimeout(() => {
    // in case we cannot connect
    if (!info.connected) {
      initializeState();
      bus.$emit('WS_STATUS_CHANGE', info);
    }
  }, 500);

  socket.onopen = () => {
    if(info.connected)
      return;

    info.connected = true;
    bus.$emit('WS_STATUS_CHANGE', info);
    initializeState();
  }

  socket.onclose = () => {
    if(!info.connected)
      return;

    info.connected = false;
    bus.$emit('WS_STATUS_CHANGE', info);
  }

  socket.onerror = () => {
    if(!info.connected)
      return;

    info.connected = false;
    bus.$emit('WS_STATUS_CHANGE', info);
  }

  socket.onmessage = function(message: any) {
    let payload = JSON.parse(message.data);
    bus.$emit(payload.type, payload);
  };
};

