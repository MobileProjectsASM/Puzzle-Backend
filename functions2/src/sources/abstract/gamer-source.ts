import { Gamer, Game } from "../../data/entities";

export interface GamerSource {
    getGamerById(gamerId: string): Promise<Gamer>;
    createGamer(gamerData: Gamer): Promise<void>;
    addGamesToGamer(gamerId: string, games: Game[]): Promise<void>;
}