export type Gamer = {
    gamerId: string;
    gamerNickName: string;
    gamerAge: number;
    gamerCountry: string;
    gamerCountryFlag?: string;
    gamerImage: string;
}

type Language = {
    en: string;
    es: string;
}

type Style = {
    color: string;
    numbers: string;
}

export type Level = {
    levelId: string;
    levelImage: string;
    levelName: Language;
    levelOrder: number;
    metrics: any;
    response: string;
    theme: Style[]
}

export type Game = {
    gameId: string;
    levelInfo: Level,
    gameStatus: GameStatus;
}

export enum GameStatus {
    new,
    lock
}