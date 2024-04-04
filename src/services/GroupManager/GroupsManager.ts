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

  public findByIdOrCreate = (groupId: string) :GroupState => {
    const groupFound = this.findById(groupId);
    if (groupFound !== undefined && groupFound !== null) {
      return groupFound;
    } else {
      return  new GroupState(groupId);
    }
  }

  public create = (groupId: string): GroupState => {
    if (!this.groups.has(groupId)) {
      const group = new GroupState(groupId);
      this.groups.set(groupId, group);

      return group;
    }

    return this.groups.get(groupId)!;
  };

  public has = (groupId: string): boolean => {
    return this.groups.has(groupId);
  };
}

export { GroupsManager };
