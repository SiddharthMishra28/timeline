import Dexie, { type Table } from 'dexie';
import { MemoryEntry, UserSettings } from '../types';

export class MyDatabase extends Dexie {
  memories!: Table<MemoryEntry>;
  settings!: Table<UserSettings>;

  constructor() {
    super('MemoryTimelineDB_v2'); // Increment version name for fresh start with new schema
    this.version(1).stores({
      memories: '++id, title, eventDateTime, category, *tags, pinned, favorite, isAchievement',
      settings: 'id'
    });
  }
}

export const db = new MyDatabase();
