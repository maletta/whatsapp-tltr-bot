// GroupState.test.ts

import { Summary } from 'models/Summary';
import { GroupState } from './GroupState';
import { EnumTimeLimit } from 'enums/TimeLimit';
import { Horoscope } from 'models/Horoscope';
import { EnumHoroscope } from 'enums/Horoscope';

describe('GroupState', () => {
  let groupState: GroupState;
  const groupId = 'testGroup';

  beforeEach(() => {
    groupState = new GroupState(groupId);
  });

  it('should create a GroupState instance with correct properties', () => {
    expect(groupState.getGroupId()).toEqual(groupId);
    expect(groupState.getSummaries()).toBeDefined();
    expect(groupState.getHoroscopes()).toBeDefined();
  });

  it('should add and retrieve summaries correctly', () => {
    const summary = new Summary({
      key: EnumTimeLimit['1_HOUR'],
      content: 'Test summary content',
    });
    groupState.getSummaries().addItem(EnumTimeLimit['1_HOUR'], summary);
    expect(groupState.getSummaries().getItem(EnumTimeLimit['1_HOUR'])).toEqual(
      summary,
    );
  });

  it('should add and retrieve horoscopes correctly', () => {
    const horoscope = new Horoscope({
      key: EnumHoroscope.Aries,
      content: 'Test horoscope content',
    });
    groupState.getHoroscopes().addItem(EnumHoroscope.Aries, horoscope);
    expect(groupState.getHoroscopes().getItem(EnumHoroscope.Aries)).toEqual(
      horoscope,
    );
  });
});
