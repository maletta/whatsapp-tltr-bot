/* eslint-disable max-classes-per-file */
import { EnumHoroscope } from 'enums/Horoscope';
import { EnumTimeLimit } from 'enums/TimeLimit';
import { BaseModel } from 'models/BaseModel';
import { Horoscope } from 'models/Horoscope';
import { Summary } from 'models/Summary';

// type IGroupId = string;
// type IGroupsSummarys = Map<IGroupId, SummariesManager>;
// type IGroupsHoroscopes = Map<IGroupId, HoroscopeManager>;

type IListOfGeneratedTexts<
  TextEnum = Enumerator,
  TextModel = BaseModel<TextEnum>,
> = Map<TextEnum, TextModel>;

type SummaryList = IListOfGeneratedTexts<EnumTimeLimit, Summary>;
type HoroscopeList = IListOfGeneratedTexts<EnumHoroscope, Horoscope>;

class GroupState {
  public groupId: string;
  public summarys: SummaryList;
  public horoscopes: HoroscopeList;

  constructor(groupId: string) {
    this.summarys = new Map();
    this.horoscopes = new Map();
    this.groupId = groupId;
  }
}

export { GroupState };
