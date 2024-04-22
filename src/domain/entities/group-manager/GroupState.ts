import { EnumHoroscope } from 'domain/enums/text-generation/Horoscope';

import { GeneratedTextsGroup } from './GeneratedTextsGroup';
import { EnumTimeLimit } from 'domain/enums/text-generation/TimeLimit';
import { Summary } from '../text-generation/Summary';
import { Horoscope } from '../text-generation/Horoscope';

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
