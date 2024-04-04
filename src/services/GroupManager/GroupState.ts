/* eslint-disable max-classes-per-file */
import { EnumHoroscope } from 'enums/Horoscope';
import { EnumTimeLimit } from 'enums/TimeLimit';
// import { BaseModel } from 'models/BaseModel';
import { Horoscope } from 'models/Horoscope';
import { Summary } from 'models/Summary';

import { GeneratedTextsGroup } from './GeneratedTextsGroup';

// type IGroupId = string;
// type IGroupsSummarys = Map<IGroupId, SummariesManager>;
// type IGroupsHoroscopes = Map<IGroupId, HoroscopeManager>;

// type IListOfGeneratedTexts<T = Enumerator, U = BaseModel<T>> = Map<T, U>;
// type SummaryList = IListOfGeneratedTexts<EnumTimeLimit, Summary>;
// type HoroscopeList = IListOfGeneratedTexts<EnumHoroscope, Horoscope>;

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
