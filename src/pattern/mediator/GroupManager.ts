import { Summary } from '../model/Summary';
import { TimeLimitOption } from '../model/TimeLimit';
import { SummariesManager } from './SummarizeManager';

type IGroupId = string;
type IGroups = Map<IGroupId, SummariesManager>;
class GroupManager {
  private groups: IGroups;

  constructor() {
    this.groups = new Map();
  }

  public addSummary(
    groupId: IGroupId,
    timeLimitOption: TimeLimitOption,
    text: string,
  ): SummariesManager {
    if (this.has(groupId)) {
      console.log(`Group already exists with id ${groupId}`);
      const group = this.groups.get(groupId);
      group.add(timeLimitOption, text);

      return group;
    }

    const summary = new SummariesManager();
    summary.add(timeLimitOption, text);
    this.groups.set(groupId, summary);

    return summary;
  }

  public getGroupById(groupId: IGroupId): SummariesManager | null {
    if (this.groups.has(groupId)) {
      return this.groups.get(groupId);
    }
    return null;
  }

  public getSummaryById(
    groupId: IGroupId,
    timeLimitOption: TimeLimitOption,
  ): Summary | null {
    const group = this.getGroupById(groupId);
    if (group !== null) {
      const summary = group.getSummaryById(timeLimitOption);
      return summary;
    }

    return null;
  }

  public has(groupId: IGroupId): boolean {
    return this.groups.has(groupId);
  }
}

export { GroupManager };
