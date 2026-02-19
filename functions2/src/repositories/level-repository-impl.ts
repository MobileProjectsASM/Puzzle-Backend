import { Level } from '../data/entities';
import { LevelSource, Logger } from '../sources/sources';
import { LevelRepository } from './repositories';

export class LevelRepositoryImpl implements LevelRepository {
  static TAG = 'level-repository';
  private static INIT_LEVELS_ORDER = [1, 2];

  constructor(
    private logger: Logger,
    private levelSource: LevelSource,
  ) {}

  async getInitLevels(): Promise<Level[]> {
    try {
      const initLevels = await this.levelSource.getLevelsByOrder(LevelRepositoryImpl.INIT_LEVELS_ORDER);
      this.logger.info(LevelRepositoryImpl.TAG, `init levels: ${initLevels}`);
      return initLevels;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(LevelRepositoryImpl.TAG, 'error to get init levels', error);
        throw error;
      } else {
        this.logger.error(LevelRepositoryImpl.TAG, 'error to get init levels, unknown error');
        throw new Error('unknown error');
      }
    }
  }
}
