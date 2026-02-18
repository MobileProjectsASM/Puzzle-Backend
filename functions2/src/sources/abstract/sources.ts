import { Gamer, Game, Level } from "../../data/entities";

export interface GamerSource {
    getGamerById(gamerId: string): Promise<Gamer>;
    createGamer(gamerData: Gamer): Promise<void>;
    addGamesToGamer(gamerId: string, games: Game[]): Promise<void>;
}

export interface LevelSource {
    getLevelsByOrder(order: number[]): Promise<Level[]>;
}