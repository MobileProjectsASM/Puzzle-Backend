import { Gamer, Level, Game, GameStatus } from "../data/entities"
import { GamerSource, Logger, RandomId } from "../sources/sources";
import { GamerRepository } from "./repositories";

export class GamerRepositoryImpl implements GamerRepository {
    static TAG: string = "gamer-repository";

    constructor(private logger: Logger, private gamerSource: GamerSource, private randomId: RandomId) {}

    async verifyGamerExists(gamerId: string) {
        try {
            const gamer = await this.gamerSource.getGamerById(gamerId);
            this.logger.info(GamerRepositoryImpl.TAG, `gamer is ${gamer}`);
            return gamer !== null;
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(GamerRepositoryImpl.TAG, 'error to verify gamer exists', error)
                throw error
            } else {
                this.logger.error(GamerRepositoryImpl.TAG, 'error to verify gamer exists, unknown error')
                throw new Error("unknown error")
            }
        }
    }

    async createGamer(gamer: Gamer, initLevels: Level[]) {
        try {
            const initGames = this.createInitGames(initLevels);
            await this.gamerSource.createGamer(gamer);
            await this.gamerSource.addGamesToGamer(gamer.gamerId, initGames);
            return gamer.gamerId;
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(GamerRepositoryImpl.TAG, 'error to create gamer', error)
                throw error
            } else {
                this.logger.error(GamerRepositoryImpl.TAG, 'error to create gamer, unknown error')
                throw new Error("unknown error")
            }
        }
    }

    private createInitGames(initLevels: Level[]) {
        return initLevels.map(initLevel => ({
            gameId: this.randomId.generateId(),
            gameStatus: initLevel.levelOrder == 1 ? GameStatus.new : GameStatus.lock,
            levelInfo: initLevel
        }) as Game);
    }
}