import { GroupManager } from './GroupManager';
import { SummariesManager } from './SummarizeManager';
import { ISummaryDTO, Summary } from './Summary';

describe('Summary', () => {
  test('isValid() should return true if the summary is not expired', () => {
    const summaryData: ISummaryDTO = {
      content: 'Test summary',
      timeLimit: '30_MINUTES',
    };
    const summary = new Summary(summaryData);
    expect(summary.isValid()).toBe(true);
  });

  test('isValid() should return false if the summary is expired', () => {
    const summaryData: ISummaryDTO = {
      content: 'Test summary',
      timeLimit: '30_MINUTES',
      createdAt: new Date(Date.now() - 31 * 60 * 1000), // 31 minutes ago
    };
    const summary = new Summary(summaryData);
    expect(summary.isValid()).toBe(false);
  });

  test('formatExpiration() should return "expirado" if the summary is expired', () => {
    const summaryData: ISummaryDTO = {
      content: 'Test summary',
      timeLimit: '30_MINUTES',
      createdAt: new Date(Date.now() - 31 * 60 * 1000), // 31 minutes ago
    };
    const summary = new Summary(summaryData);
    expect(summary.formatExpiration()).toBe('expirado');
  });

  test('formatExpiration() should return a formatted expiration date if the summary is not expired', () => {
    const summaryData: ISummaryDTO = {
      content: 'Test summary',
      timeLimit: '30_MINUTES',
    };
    const summary = new Summary(summaryData);
    expect(summary.formatExpiration()).toMatch(
      /^\d{2}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    );
  });

  test('formatCreatedAt() should return a formatted creation date', () => {
    const summaryData: ISummaryDTO = {
      content: 'Test summary',
      timeLimit: '30_MINUTES',
      createdAt: new Date('2024-03-15T17:00:00Z'),
    };
    const summary = new Summary(summaryData);
    expect(summary.formatCreatedAt()).toBe('15-03-24 17:00:00');
  });
});

describe('SummariesManager', () => {
  test('add() should add a summary to the manager', () => {
    const manager = new SummariesManager();
    manager.add('30_MINUTES', 'Test summary');
    expect(manager.hasValidSummary('30_MINUTES')).toBe(true);
  });

  test('delete() should delete a summary from the manager', () => {
    const manager = new SummariesManager();
    manager.add('30_MINUTES', 'Test summary');
    manager.delete('30_MINUTES');
    expect(manager.hasValidSummary('30_MINUTES')).toBe(false);
  });

  test('hasValidSummary() should return true if a valid summary exists', () => {
    const manager = new SummariesManager();
    manager.add('30_MINUTES', 'Test summary');
    expect(manager.hasValidSummary('30_MINUTES')).toBe(true);
  });

  test('hasValidSummary() should return false if no valid summary exists', () => {
    const manager = new SummariesManager();
    expect(manager.hasValidSummary('30_MINUTES')).toBe(false);
  });
});

describe('GroupManager', () => {
  test('addSummary() should add a summary to the group', () => {
    const manager = new GroupManager();
    manager.addSummary('group1', '30_MINUTES', 'Test summary');
    const test = manager.getSummaryById('group1', '30_MINUTES');
    console.log('sum ', test);
    expect(test).not.toBeNull();
  });

  test('addSummary() should not add a summary if a valid summary with the same time limit exists', () => {
    const manager = new GroupManager();
    manager.addSummary('group1', '30_MINUTES', 'Test summary');
    expect(manager.getSummaryById('group1', '30_MINUTES')).not.toBeNull();

    // Wait for the summary to expire
    jest.advanceTimersByTime(31 * 60 * 1000);

    manager.addSummary('group1', '30_MINUTES', 'New summary');
    expect(manager.getSummaryById('group1', '30_MINUTES')).not.toBeNull();
  });
});

// Advance timers to simulate the expiration of summaries
jest.useFakeTimers();
