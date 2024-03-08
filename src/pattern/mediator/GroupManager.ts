import { SummariesManager } from './SummarizeManager';

type IGroupId = string;

class GroupManager {
  private groups: Map<IGroupId, SummariesManager>;

  constructor() {
    this.groups = new Map();
  }
}

export { GroupManager };
