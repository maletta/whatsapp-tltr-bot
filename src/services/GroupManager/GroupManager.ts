/* eslint-disable max-classes-per-file */
import { EnumHoroscope } from 'enums/Horoscope';
import { EnumTimeLimit } from 'enums/TimeLimit';
import { BaseModel } from 'models/BaseModel';
import { Horoscope } from 'models/Horoscope';
import { Summary } from 'models/Summary';

// type IGroupId = string;
// type IGroupsSummarys = Map<IGroupId, SummariesManager>;
// type IGroupsHoroscopes = Map<IGroupId, HoroscopeManager>;

type IListOfGeneratedTexts<T = Enumerator, U = BaseModel<T>> = Map<T, U>;

type SummaryList = IListOfGeneratedTexts<EnumTimeLimit, Summary>;
type HoroscopeList = IListOfGeneratedTexts<EnumHoroscope, Horoscope>;

class GroupState {
  public groupId: string;
  public summaries: SummaryList;
  public horoscopes: HoroscopeList;

  constructor(groupId: string) {
    this.summaries = new Map();
    this.horoscopes = new Map();
    this.groupId = groupId;
  }
}

export { GroupState };
