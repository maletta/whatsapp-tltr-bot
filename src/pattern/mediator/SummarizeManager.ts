import { Summary } from '../model/Summary';
import { TimeLimitOption } from '../model/TimeLimit';

class SummariesManager {
  // The `summaries` map holds TimeLimitKey as keys and Summary as values.
  // It is used to store summaries with their respective time limits.
  private summaries: Map<TimeLimitOption, Summary>;

  constructor() {
    this.summaries = new Map();
  }

  // Adds a new summary to the `summaries` map using the provided key and summary.
  public add(key: TimeLimitOption, summary: Summary) {
    this.summaries.set(key, summary);
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
  public hasValidSummarize(key: TimeLimitOption) {
    if (this.summaries.has(key)) {
      const summary = this.summaries.get(key);
      if (new Date().getTime() > summary.expiresIn.getTime()) {
        return true;
      }
    }

    return false;
  }
}
export { SummariesManager };
