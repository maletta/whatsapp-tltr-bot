interface ITextSummarize {
  summarize(text: string): Promise<string>;
}

export type { ITextSummarize };
