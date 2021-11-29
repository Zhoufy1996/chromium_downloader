// eslint-disable-next-line @typescript-eslint/no-unused-vars
import electron, { Tray } from 'electron';
// 类型“Global & typeof globalThis”上不存在属性“mainId”

declare global {
  namespace NodeJS {
    interface Global {
      tray: Tray | undefined;
      mianId: number;
    }
  }
}
