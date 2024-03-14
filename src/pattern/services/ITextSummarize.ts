interface ITextSummarize {
  summarize(prompt: string): Promise<string>;
}

export type { ITextSummarize };
