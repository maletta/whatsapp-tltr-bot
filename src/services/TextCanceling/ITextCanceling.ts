interface ITextCanceling {
  canceling(prompt: string, message: string): Promise<string>;
}

export type { ITextCanceling };
