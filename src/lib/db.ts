import Dexie, { type Table } from 'dexie';
import { MemoryEntry, UserSettings, UserProfile, PointsLog } from '../types';

export class MemoryTimelineDB extends Dexie {
  memories!: Table<MemoryEntry>;
  settings!: Table<UserSettings>;
  profile!: Table<UserProfile>;
  pointsLog!: Table<PointsLog>;

  constructor() {
    super('MemoryTimelineDB_v3');
    this.version(1).stores({
      memories: '++id, title, eventDateTime, category, *tags, pinned, favorite, isAchievement',
      settings: 'id'
    });
    this.version(2).stores({
      memories: '++id, title, eventDateTime, category, *tags, pinned, favorite, isAchievement',
      settings: 'id',
      profile: '++id, username',
      pointsLog: '++id, action, timestamp, memoryId'
    });
  }
}

export const db = new MemoryTimelineDB();
