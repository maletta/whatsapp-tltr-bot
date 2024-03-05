import { ITextSummarize } from '../ITextSummarize';

class TextSummarizeHttp implements ITextSummarize {
  summarize(text: string): Promise<string> {
    const projectId = process.env.PROJECT_ID;
    const location = 'us-central1';
    const model = 'gemini-1.0-pro-vision';
  }
}

export { TextSummarizeHttp };
