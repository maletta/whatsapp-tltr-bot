interface ITextSummarize {
  summarize(prompt: string, message: string): Promise<string>;
  summarizeBatch(prompt: string, messages: string[]): Promise<string[]>;
}

export type { ITextSummarize };
