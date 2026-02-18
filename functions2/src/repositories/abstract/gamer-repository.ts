import { Gamer, Level } from "../../data/entities";

export interface GamerRepository {
    verifyGamerExists(gamerId: string): Promise<Boolean>;
    createGamer(gamer: Gamer, initLevels: Level[]): Promise<string>;
}