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

  public findByIdOrCreate = (groupId: string): GroupState => {
    const groupFound = this.findById(groupId);
    if (groupFound !== undefined && groupFound !== null) {
      return groupFound;
    } else {
      return this.create(groupId);
    }
  };

  public create = (groupId: string): GroupState => {
    const group = new GroupState(groupId);
    this.groups.set(groupId, group);

    return group;
  };

  public has = (groupId: string): boolean => {
    return this.groups.has(groupId);
  };
}

// console.log("testando log de funções")
export { GroupsManager };
