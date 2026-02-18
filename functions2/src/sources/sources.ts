import { Gamer, Game, Level } from "../data/entities";

export interface GamerSource {
    getGamerById(gamerId: string): Promise<Gamer>;
    createGamer(gamerData: Gamer): Promise<void>;
    addGamesToGamer(gamerId: string, games: Game[]): Promise<void>;
}

export interface LevelSource {
    getLevelsByOrder(order: number[]): Promise<Level[]>;
}

export interface Logger {
    info(tag: string, message: string): void;
    error(tag: string, message: string, err?: Error): void
}

export interface RandomId {
    generateId(): string;
}