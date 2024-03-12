import { SummariesManager } from './SummarizeManager';

type IGroupId = string;

class GroupManager {
  private groups: Map<IGroupId, SummariesManager>;

  constructor() {
    this.groups = new Map();
  }

  public add(groupId: IGroupId): SummariesManager {
    if (this.has(groupId)) {
      console.log(`Group already exists with id ${groupId}`);
      return this.get(groupId);
    }

    const group = new SummariesManager();
    this.groups.set(groupId, group);
    return group;
  }

  public get(groupId: IGroupId): SummariesManager | undefined {
    return this.groups.get(groupId);
  }

  public has(groupId: IGroupId): boolean {
    return this.groups.has(groupId);
  }
}

export { GroupManager };
