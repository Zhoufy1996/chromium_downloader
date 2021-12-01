/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { v4 as uuidv4 } from 'uuid';

export interface Listener {
  (event: IpcRendererEvent, ...args: any[]): void;
}

interface BrowserIpcListener {
  (messages: string[]): void;
}

class BrowserIpc {
  private messages: string[] = [];

  listeners: { key: string; cb: BrowserIpcListener }[] = [];

  addBrowserIpcListener(cb: BrowserIpcListener) {
    const key = uuidv4();
    this.listeners.push({
      key,
      cb,
    });
    cb(this.messages);
    return key;
  }

  removeBrowserIpcListener(key: string) {
    this.listeners = this.listeners.filter((item) => {
      return item.key !== key;
    });
  }

  emit() {
    this.listeners.forEach((listener) => {
      listener.cb(this.messages);
    });
  }

  createMessage(callName: string, channel: string, listenerNameOrArgs: string) {
    const msg = `[${callName}]. [${channel}]. [${listenerNameOrArgs}]. [${dayjs().format(
      'YYYY-MM-DD HH mm ss'
    )}]`;
    this.messages.push(msg);
    this.emit();
  }

  on(channel: string, listener: Listener = () => {}) {
    this.createMessage('on', channel, listener.name);
    return ipcRenderer.on(channel, listener);
  }

  invoke(channel: string, ...args: any[]) {
    this.createMessage('invoke', channel, args.toString());
    return ipcRenderer.invoke(channel, ...args);
  }

  send(channel: string, ...args: any[]) {
    this.createMessage('send', channel, args.toString());
    return ipcRenderer.send(channel, ...args);
  }

  getMessages() {
    return this.messages;
  }

  removeListener(channel: string, listener: Listener = () => {}) {
    this.createMessage('removeListener', channel, listener.name);
    return ipcRenderer.removeListener(channel, listener);
  }
}

const browerIpc = new BrowserIpc();

export default browerIpc;
