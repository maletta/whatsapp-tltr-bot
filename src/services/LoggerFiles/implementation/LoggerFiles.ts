import fs from 'fs';
import path from 'path';

import { ILoggerFiles } from '../ILoggerFiles';

class LoggerFiles implements ILoggerFiles {
  private static instance: ILoggerFiles;
  private logsDirectory: string;

  private constructor() {
    console.log('dir name ', __dirname);
    this.logsDirectory = path.join(__dirname, '..', '..', '..', '..', 'logs');
  }

  public static getInstance(): ILoggerFiles {
    if (!LoggerFiles.instance) {
      LoggerFiles.instance = new LoggerFiles();
    }
    return LoggerFiles.instance;
  }

  private ensureLogsDirectoryExists(path: string): void {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }

  public log = (folderName: string, logFileName: string, message: string) => {
    const groupLogsDirectory = path.join(this.logsDirectory, folderName);
    this.ensureLogsDirectoryExists(groupLogsDirectory);

    const logFilePath = path.join(groupLogsDirectory, `${logFileName}.log`);

    try {
      fs.appendFileSync(logFilePath, message);
    } catch (error) {
      console.log(`Error on save log ${folderName} - ${logFileName}`);
      console.log(error);
    }
  };
}

export { LoggerFiles };
