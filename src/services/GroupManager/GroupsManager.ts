import { GroupState } from './GroupState';

type IGroups = Map<string, GroupState>;
class GroupsManager {
  private groups: IGroups;

  constructor() {
    this.groups = new Map();
  }

  public findById = (groupId: string): GroupState | undefined | null => {
    return this.groups.get(groupId);
  };

  public create = (groupId: string): GroupState => {
    if (!this.groups.has(groupId)) {
      const group = new GroupState(groupId);
      this.groups.set(groupId, group);

      return group;
    }

    return this.findById(groupId);
  };

  public has = (groupId: string): boolean => {
    return this.groups.has(groupId);
  };
}

export { GroupsManager };
