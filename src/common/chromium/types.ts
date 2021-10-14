export type ChromiumServiceSteps =
  | 'INIT'
  | 'GETREVISIONS'
  | 'SEARCHVERSIONS'
  | 'FINISHED'
  | 'ERROR'
  | 'UNDO';

export interface SpiderCallbackProps {
  step: ChromiumServiceSteps;
  searchAllCount: number;
  searchedCount: number;
}
