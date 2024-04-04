import { Horoscope } from 'models/Horoscope';
import { GroupsManager } from './GroupsManager';
import { GroupState } from './GroupState';
import { EnumHoroscope } from 'enums/Horoscope';

describe('GroupsManager', () => {
  let groupsManager: GroupsManager;

  beforeEach(() => {
    groupsManager = new GroupsManager();
  });

  it('should create a GroupsManager instance with correct properties', () => {
    // const groupsManager: GroupsManager = new GroupsManager();

    expect(groupsManager).toBeDefined();
    expect(groupsManager['groups']).toBeInstanceOf(Map);
  });

  it('should find existing group by id', () => {
    const groupId = 'testGroup';
    const groupState = groupsManager.create(groupId);

    expect(groupsManager.findById(groupId)).toEqual(groupState);
  });

  it('should return undefined when finding non-existing group by id', () => {
    const groupId = 'nonExistingGroup';
    expect(groupsManager.findById(groupId)).toBeUndefined();
  });

  it('should find or create group by id', () => {
    const groupId = 'testGroup';
    const groupState = groupsManager.findByIdOrCreate(groupId);
    expect(groupState.getGroupId()).toEqual(groupId);

    // Ensure the group was added to the manager
    expect(groupsManager.findById(groupId)).toEqual(groupState);
  });

  it('should create a new group if it does not exist', () => {
    const groupId = 'nonExistingGroup';
    const groupState = groupsManager.create(groupId);
    expect(groupState.getGroupId()).toEqual(groupId);

    // Ensure the group was added to the manager
    expect(groupsManager.findById(groupId)).toEqual(groupState);
  });

  it('should return true if group exists', () => {
    const groupId = 'testGroup';
    const groupState = new GroupState(groupId);
    groupsManager['groups'].set(groupId, groupState);
    expect(groupsManager.has(groupId)).toEqual(true);
  });

  it('should return false if group does not exist', () => {
    const groupId = 'nonExistingGroup';
    expect(groupsManager.has(groupId)).toEqual(false);
  });

  it('should return the same Horoscope content', () => {
    const groupId = 'test';
    const horoscopeGroupManager = new GroupsManager();
    const group = horoscopeGroupManager.create(groupId);

    const horoscopesList = group.getHoroscopes();

    const horoscopeContent =
      'This is a test horoscope for a test user in a test group.';
    const sign: EnumHoroscope = EnumHoroscope.Aquario;
    const horoscope = new Horoscope({
      content: horoscopeContent,
      key: sign,
    });

    horoscopesList.addItem(sign, horoscope);

    // console.dir('log horoscopesList ');
    // // console.dir(group, { depth: null });

    // console.dir(
    //   horoscopeGroupManager.findById(groupId)?.getHoroscopes().getItem(sign),
    //   {
    //     depth: null,
    //   },
    // );

    expect(true);
    expect(
      horoscopeGroupManager.findById(groupId)?.getHoroscopes().getItem(sign)
        ?.content,
    ).toEqual(horoscopeContent);
  });
});
