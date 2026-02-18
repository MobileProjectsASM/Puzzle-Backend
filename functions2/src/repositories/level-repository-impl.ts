import { Level } from "../data/entities";
import { LevelSource } from "../sources/abstract/sources";
import { Logger } from "../sources/abstract/util-sources";
import { LevelRepository } from "./repositories";

export class LevelRepositoryImpl implements LevelRepository {

    static TAG = "level-repository"
    private static INIT_LEVELS_ORDER = [1, 2];

    constructor(private logger: Logger, private levelSource: LevelSource) {}

    async getInitLevels(): Promise<Level[]> {
        try {
            const initLevels = await this.levelSource.getLevelsByOrder(LevelRepositoryImpl.INIT_LEVELS_ORDER);
            this.logger.info(LevelRepositoryImpl.TAG, `init levels: ${initLevels}`);
            return initLevels;
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(LevelRepositoryImpl.TAG, 'error to create gamer', error)
                throw error
            } else {
                this.logger.error(LevelRepositoryImpl.TAG, 'error to create gamer, unknown error')
                throw new Error("unknown error")
            }
        }
    }
}