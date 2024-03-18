import fs from 'fs';

import { ILoggerFiles } from '../ILoggerFiles';
import { LoggerFiles } from './LoggerFiles';

// Criando um mock para a função fs.existsSync
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  appendFileSync: jest.fn(),
}));

describe('LoggerFile', () => {
  let logger: ILoggerFiles;

  beforeEach(() => {
    logger = LoggerFiles.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should create logs directory if it does not exist', () => {
      const folderName = 'testFolder';
      const logFileName = 'testLog';
      const message = 'Test message';

      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

      logger.log(folderName, logFileName, message);

      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining('logs'),
      );
      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining(folderName),
      );
      expect(fs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('logs'),
      );
      expect(fs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining(folderName),
      );
    });

    it('should write message to log file', () => {
      const folderName = 'testFolder';
      const logFileName = 'testLog';
      const message = 'Test message';

      (fs.existsSync as jest.Mock).mockReturnValue(true);

      logger.log(folderName, logFileName, message);

      expect(fs.appendFileSync).toHaveBeenCalledWith(
        expect.stringContaining(logFileName),
        message,
      );
    });

    it('should handle errors when saving log', () => {
      const folderName = 'testFolder';
      const logFileName = 'testLog';
      const message = 'Test message';
      const errorMessage = 'Error saving log';

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.appendFileSync as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      logger.log(folderName, logFileName, message);

      expect(consoleSpy).toHaveBeenCalledWith(
        `Error on save log ${folderName} - ${logFileName}`,
      );
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
