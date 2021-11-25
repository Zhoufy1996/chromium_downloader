/* eslint-disable class-methods-use-this */
import dayjs from 'dayjs';
import { ipcRenderer, IpcRendererEvent } from 'electron';

interface Listener {
  (event: IpcRendererEvent, ...args: any[]): void;
}

class BrowserIpc {
  private messages: string[] = [];

  createMessage(callName: string, channel: string, listenerName: string) {
    const msg = `[${callName}]. [${channel}]. [${listenerName}]. [${dayjs()}]`;
    this.messages.push(msg);
  }

  on(channel: string, listener: Listener) {
    this.messages.push('on', channel, listener.name);
    return ipcRenderer.on(channel, listener);
  }

  getMessages() {
    return this.messages;
  }
}

const browerIpc = new BrowserIpc();

export default browerIpc;
