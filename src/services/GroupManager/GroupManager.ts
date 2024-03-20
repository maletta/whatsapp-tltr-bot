import { EnumHoroscope } from 'enums/Horoscope';
import { TimeLimitOption } from 'enums/TimeLimit';
import { Horoscope } from 'models/Horoscope';
import { Summary } from 'models/Summary';

import { HoroscopeManager } from '../HoroscopeManager';
import { SummariesManager } from '../SummarizeManager';

type IGroupId = string;
type IGroupsSummarys = Map<IGroupId, SummariesManager>;
type IGroupsHoroscopes = Map<IGroupId, HoroscopeManager>;
class GroupManager {
  private summarys: IGroupsSummarys;
  private horoscopes: IGroupsHoroscopes;

  constructor() {
    this.summarys = new Map();
    this.horoscopes = new Map();
  }

  public addSummary(
    groupId: IGroupId,
    timeLimitOption: TimeLimitOption,
    text: string,
  ): SummariesManager {
    if (this.hasSummary(groupId)) {
      console.log(`Group already exists with id ${groupId}`);
      const group = this.summarys.get(groupId);
      group.add(timeLimitOption, text);

      return group;
    }

    const summary = new SummariesManager();
    summary.add(timeLimitOption, text);
    this.summarys.set(groupId, summary);

    return summary;
  }

  public getSummaryGroupById(groupId: IGroupId): SummariesManager | null {
    if (this.summarys.has(groupId)) {
      return this.summarys.get(groupId);
    }
    return null;
  }

  public getSummaryById(
    groupId: IGroupId,
    timeLimitOption: TimeLimitOption,
  ): Summary | null {
    const group = this.getSummaryGroupById(groupId);
    if (group !== null) {
      const summary = group.getSummaryById(timeLimitOption);
      return summary;
    }

    return null;
  }

  public hasSummary(groupId: IGroupId): boolean {
    return this.summarys.has(groupId);
  }

  public addHoroscope(
    groupId: IGroupId,
    horoscopeEnum: EnumHoroscope,
    text: string,
  ): HoroscopeManager {
    if (this.hasSummary(groupId)) {
      console.log(`Group already exists with id ${groupId}`);
      const group = this.horoscopes.get(groupId);
      group.add(horoscopeEnum, text);

      return group;
    }

    const horoscope = new HoroscopeManager();
    horoscope.add(horoscopeEnum, text);
    this.horoscopes.set(groupId, horoscope);

    return horoscope;
  }

  public getHoroscopeGroupById(groupId: IGroupId): HoroscopeManager | null {
    if (this.horoscopes.has(groupId)) {
      return this.horoscopes.get(groupId);
    }
    return null;
  }

  public getHoroscopeById(
    groupId: IGroupId,
    horoscopeEnum: EnumHoroscope,
  ): Horoscope | null {
    const group = this.getHoroscopeGroupById(groupId);
    if (group !== null) {
      const horoscope = group.getHoroscopeById(horoscopeEnum);
      return horoscope;
    }

    return null;
  }

  public hasHoroscope(groupId: IGroupId): boolean {
    return this.horoscopes.has(groupId);
  }
}

export { GroupManager };
