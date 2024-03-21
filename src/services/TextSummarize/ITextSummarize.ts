interface ITextSummarize {
  summarize(prompt: string, message: string): Promise<string | null>;
  summarizeBatch(prompt: string, messages: string[]): Promise<string | null>;
}

export type { ITextSummarize };
