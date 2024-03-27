interface ITextGeneration {
  generate(prompt: string): Promise<string | null>;
  generateBatch(prompt: string, messages: string[]): Promise<string | null>;
}

export type { ITextGeneration };
