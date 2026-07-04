import Dexie, { type Table } from 'dexie';
import { MemoryEntry, UserSettings } from '../types';

export class MyDatabase extends Dexie {
  memories!: Table<MemoryEntry>;
  settings!: Table<UserSettings>;

  constructor() {
    super('MemoryTimelineDB');
    this.version(1).stores({
      memories: '++id, title, eventDateTime, category, *tags, pinned, favorite',
      settings: 'id'
    });
  }
}

export const db = new MyDatabase();
