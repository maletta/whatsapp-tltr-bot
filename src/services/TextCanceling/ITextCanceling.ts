interface ITextCanceling {
  canceling(prompt: string, message: string): Promise<string | null>;
}

export type { ITextCanceling };
