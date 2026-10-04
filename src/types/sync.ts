export type SyncAction = 'create' | 'update' | 'delete';

export interface SyncQueueItem {
  id: string;
  collection: string;
  action: SyncAction;
  docId: string;
  payload: any;
  timestamp: number;
}
