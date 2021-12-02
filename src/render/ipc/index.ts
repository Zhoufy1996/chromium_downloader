/* eslint-disable @typescript-eslint/no-explicit-any */
import { IpcRendererEvent } from 'electron';

export interface Listener {
  (event: IpcRendererEvent, ...args: any[]): void;
}
