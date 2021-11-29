/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import { ipcRenderer, IpcRendererEvent } from 'electron';

export interface Listener {
  (event: IpcRendererEvent, ...args: any[]): void;
}

class BrowserIpc {
  private messages: string[] = [];

  createMessage(callName: string, channel: string, listenerNameOrArgs: string) {
    const msg = `[${callName}]. [${channel}]. [${listenerNameOrArgs}]. [${dayjs()}]`;
    this.messages.push(msg);
  }

  on(channel: string, listener: Listener = () => {}) {
    this.messages.push('on', channel, listener.name);
    return ipcRenderer.on(channel, listener);
  }

  invoke(channel: string, ...args: any[]) {
    this.messages.push('invoke', channel, args.toString());
    return ipcRenderer.invoke(channel, ...args);
  }

  send(channel: string, ...args: any[]) {
    this.messages.push('send', channel, args.toString());
    return ipcRenderer.send(channel, ...args);
  }

  getMessages() {
    return this.messages;
  }

  removeListener(channel: string, listener: Listener = () => {}) {
    this.messages.push('removeListener', channel, listener.name);
    return ipcRenderer.removeListener(channel, listener);
  }
}

const browerIpc = new BrowserIpc();

export default browerIpc;
