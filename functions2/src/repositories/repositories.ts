import { Gamer, Level } from '../data/entities';

export interface GamerRepository {
  verifyGamerExists(gamerId: string): Promise<boolean>;
  createGamer(gamer: Gamer, initLevels: Level[]): Promise<string>;
}

export interface LevelRepository {
  getInitLevels(): Promise<Level[]>;
}
