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
    levelId: String;
    levelImage: String;
    levelName: Language;
    levelOrder: number;
    metrics: any;
    response: string;
    theme: Style[]
}

export type Game = {
    gameId: String;
    levelInfo: Level,
    gameStatus: GameStatus;
}

export enum GameStatus {
    new,
    lock
}