import { Summary } from '@model/Summary';

import { TimeLimitOption } from './TimeLimit';

class SummariesManager {
  // The `summaries` map holds TimeLimitKey as keys and Summary as values.
  // It is used to store summaries with their respective time limits.
  private summaries: Map<TimeLimitOption, Summary>;

  constructor() {
    this.summaries = new Map();
  }

  // Adds a new summary to the `summaries` map using the provided key and summary.
  public add(key: TimeLimitOption, text: string) {
    this.delete(key);
    const summary = new Summary({ content: text, timeLimit: key });
    this.summaries.set(key, summary);
  }

  public getSummaryById(key: TimeLimitOption): Summary | null {
    if (this.summaries.has(key)) {
      return this.summaries.get(key);
    }
    return null;
  }

  // Deletes the summary associated with the given key from the `summaries` map.
  public delete(key: TimeLimitOption) {
    if (this.summaries.has(key)) {
      this.summaries.delete(key);
    }
  }

  // Checks if there is a valid summary available for the given key.
  // Returns true if the key exists and the summary has not expired,
  // otherwise, it returns false.
  public hasValidSummary(key: TimeLimitOption) {
    if (this.summaries.has(key)) {
      const summary = this.summaries.get(key);
      if (new Date().getTime() < summary.expiresIn.getTime()) {
        return true;
      }
    }

    return false;
  }
}
export { SummariesManager };
