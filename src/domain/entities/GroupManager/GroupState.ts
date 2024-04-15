import { EnumHoroscope } from 'domain/enums/Horoscope';

import { GeneratedTextsGroup } from './GeneratedTextsGroup';
import { EnumTimeLimit } from 'domain/enums/TimeLimit';
import { Summary } from '../Summary';
import { Horoscope } from '../Horoscope';

class GroupState {
  private groupId: string;
  private summaries: GeneratedTextsGroup<EnumTimeLimit, Summary>;
  private horoscopes: GeneratedTextsGroup<EnumHoroscope, Horoscope>;

  constructor(groupId: string) {
    this.summaries = new GeneratedTextsGroup();
    this.horoscopes = new GeneratedTextsGroup();
    this.groupId = groupId;
  }

  public getGroupId = (): string => {
    return this.groupId;
  };

  public getSummaries = (): GeneratedTextsGroup<EnumTimeLimit, Summary> => {
    return this.summaries;
  };

  public getHoroscopes = (): GeneratedTextsGroup<EnumHoroscope, Horoscope> => {
    return this.horoscopes;
  };
}

export { GroupState };
